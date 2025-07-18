package com.cfa.zer0.repository

import com.cfa.zer0.entity.Rated
import com.cfa.zer0.entity.Work
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import software.amazon.awssdk.services.dynamodb.model.BatchGetItemRequest
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException
import software.amazon.awssdk.services.dynamodb.model.KeysAndAttributes

@Repository
class RatedRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table("rated", TableSchema.fromClass(Rated::class.java))
    private val logger = LoggerFactory.getLogger(RatedRepository::class.java)

    fun findByUserIdAndWorkId(userId: String, workId: String): Rated? {
        return try {
            val key = Key.builder()
                .partitionValue(userId)
                .sortValue(workId)
                .build()

            val rated = table.getItem(key)
            logger.info("Found rated item for userId=$userId and workId=$workId: $rated")
            rated
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to find rated item for userId=$userId and workId=$workId",
                e
            )
        }
    }

    fun findByUserId(userId: String): List<Rated> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val results = table.query(queryConditional).items().toList()
            logger.info("Found ${results.size} rated items for userId=$userId")
            results
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to find rated items for userId=$userId",
                e
            )
        }
    }

    fun findByUserIdsAndWorkIds(ids: List<Pair<String, String>>): List<Rated> {
        return try {
            val keys = ids.map { (userId, workId) ->
                mapOf(
                    "userId" to AttributeValue.builder().s(userId).build(),
                    "workId" to AttributeValue.builder().s(workId)
                        .build()
                )
            }

            val batchGetRequest = BatchGetItemRequest.builder()
                .requestItems(
                    mapOf(
                        "rated" to KeysAndAttributes.builder().keys(keys)
                            .build()
                    )
                )
                .build()

            val response = dynamoDbClient.batchGetItem(batchGetRequest)
            val ratedItems = response.responses()["rated"]?.map { item ->
                TableSchema.fromClass(Rated::class.java).mapToItem(item)
            } ?: emptyList()

            ratedItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "指定された userId と workId の組み合わせに対する rated アイテムのバッチ取得に失敗しました",
                e
            )
        }
    }

    fun registerRated(rated: Rated): Rated {
        return try {
            table.putItem(rated)
            rated
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register rated: ${rated.userId}, workId: ${rated.workId}",
                e
            )
        }
    }

    fun deleteRated(userId: String, workId: String): Rated {
        return try {
            val key =
                Key.builder().partitionValue(userId).sortValue(workId).build()
            table.deleteItem(key)
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete rated item: userId=$userId, workId=$workId",
                e
            )
        }
    }

    fun deleteWork(workId: String) {
        try {
            // WorkIdIndex を取得
            val index = table.index("WorkIdIndex")

            // WorkIdIndex で workId をキーに検索
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(workId).build()
            )

            val results = index.query { r ->
                r.queryConditional(queryConditional)
                    .scanIndexForward(false) // 降順ソート（不要なら削除可）
            }.stream()
                .flatMap { it.items().stream() }
                .toList()

            if (results.isEmpty()) {
                logger.info("No liked items found for workId=$workId")
                return
            }

            // 取得した各アイテムを削除
            results.forEach { liked ->
                val key = Key.builder()
                    .partitionValue(liked.userId)
                    .sortValue(liked.workId)
                    .build()

                table.deleteItem(key)
                logger.info("Deleted liked item: userId=${liked.userId}, workId=${liked.workId}")
            }

            logger.info("Deleted ${results.size} liked items for workId=$workId")
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete liked items for workId=$workId",
                e
            )
        }
    }

    fun deleteUserIdById(userId: String) {
        try {
            // まず該当userIdのすべてのアイテムを取得
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val items = table.query(queryConditional).items().toList()

            // 取得した各アイテムを削除
            items.forEach { liked ->
                val key = Key.builder()
                    .partitionValue(liked.userId)
                    .sortValue(liked.workId)
                    .build()
                table.deleteItem(key)
                logger.info("Deleted liked item: userId=${liked.userId}, workId=${liked.workId}")
            }

            logger.info("Deleted ${items.size} liked items for userId=$userId")
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete liked items for userId=$userId",
                e
            )
        }
    }
}