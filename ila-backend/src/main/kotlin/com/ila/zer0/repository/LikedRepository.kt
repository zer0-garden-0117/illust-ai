package com.ila.zer0.repository

import com.ila.zer0.entity.Liked
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
class LikedRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table("liked", TableSchema.fromClass(Liked::class.java))
    private val logger = LoggerFactory.getLogger(LikedRepository::class.java)

    // 指定したユーザーのLikedのリストを取得する
    fun findByUserId(userId: String): List<Liked> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val results = table.query(queryConditional).items().toList()
            logger.info("Found ${results.size} liked items for userId=$userId")
            results
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to find liked items for userId=$userId",
                e
            )
        }
    }

    // 指定したユーザーとWorkIdのペアに対応するLikedのリストを返す
    fun findByUserIdsAndWorkIds(ids: List<Pair<String, String>>): List<Liked> {
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
                        "liked" to KeysAndAttributes.builder().keys(keys)
                            .build()
                    )
                )
                .build()

            val response = dynamoDbClient.batchGetItem(batchGetRequest)
            val likedItems = response.responses()["liked"]?.map { item ->
                TableSchema.fromClass(Liked::class.java).mapToItem(item)
            } ?: emptyList()

            likedItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "指定された userId と workId の組み合わせに対する liked アイテムのバッチ取得に失敗しました",
                e
            )
        }
    }

    fun findByWorkId(workId: String): List<Liked> {
        val index = table.index("WorkIdIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(workId).build()
        )
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        val likeds = mutableListOf<Liked>()
        queryRequest.forEach { page ->
            likeds.addAll(page.items())
        }
        return likeds
    }

    fun registerLiked(liked: Liked): Liked {
        return try {
            table.putItem(liked)
            liked
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register liked: ${liked.userId}, workId: ${liked.workId}",
                e
            )
        }
    }

    fun deleteLiked(userId: String, workId: String): Liked {
        return try {
            val key =
                Key.builder().partitionValue(userId).sortValue(workId).build()
            table.deleteItem(key)
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete liked item: userId=$userId, workId=$workId",
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

    fun findByUserIdAndWorkId(userId: String, workId: String): Liked? {
        return try {
            val key = Key.builder()
                .partitionValue(userId)
                .sortValue(workId)
                .build()

            val liked = table.getItem(key)

            if (liked == null) {
                logger.info("No liked item found for userId=$userId, workId=$workId")
            } else {
                logger.info("Found liked item for userId=$userId, workId=$workId")
            }

            liked
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to find liked item for userId=$userId, workId=$workId",
                e
            )
        }
    }

}