package com.uag.zer0.repository

import com.uag.zer0.entity.Rated
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
}