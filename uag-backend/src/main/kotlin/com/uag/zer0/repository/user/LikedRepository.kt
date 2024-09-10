package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.Liked
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.BatchWriteItemRequest
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException
import software.amazon.awssdk.services.dynamodb.model.PutRequest
import software.amazon.awssdk.services.dynamodb.model.WriteRequest

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

    fun findByUserId(userId: String): List<Liked> {
        return try {
            val index = table.index("UserUpdatedAtIndex")
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val queryRequest = index.query { r ->
                r.queryConditional(queryConditional)
                    .scanIndexForward(false)
            }

            val likedItems = mutableListOf<Liked>()
            queryRequest.forEach { page ->
                likedItems.addAll(page.items())
            }
            likedItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query liked items by userId with updatedAt: $userId",
                e
            )
        }
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

    fun registerLikedItems(likedItems: List<Liked>) {
        try {
            val tableSchema = TableSchema.fromClass(Liked::class.java)
            val writeRequests = likedItems.map { liked ->
                WriteRequest.builder()
                    .putRequest(
                        PutRequest.builder()
                            .item(tableSchema.itemToMap(liked, true)).build()
                    )
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("liked" to writeRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register liked items", e)
        }
    }

    fun deleteLiked(userId: String, workId: Int): Liked? {
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
}