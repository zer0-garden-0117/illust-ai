package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.Viewed
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
class ViewedRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table(
            "viewed",
            TableSchema.fromClass(Viewed::class.java)
        )
    private val logger = LoggerFactory.getLogger(ViewedRepository::class.java)

    fun findByUserId(userId: String): List<Viewed> {
        return try {
            val index = table.index("UserViewedUpdatedAtIndex")
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val queryRequest = index.query { r ->
                r.queryConditional(queryConditional)
                    .scanIndexForward(false)
            }

            val viewedItems = mutableListOf<Viewed>()
            queryRequest.forEach { page ->
                viewedItems.addAll(page.items())
            }
            viewedItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query viewed items by userId with updatedAt: $userId",
                e
            )
        }
    }

    fun registerViewed(viewed: Viewed): Viewed {
        return try {
            table.putItem(viewed)
            viewed
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register viewed: ${viewed.userId}, workId: ${viewed.workId}",
                e
            )
        }
    }

    fun registerViewedItems(viewedItems: List<Viewed>) {
        try {
            val tableSchema = TableSchema.fromClass(Viewed::class.java)
            val writeRequests = viewedItems.map { viewed ->
                WriteRequest.builder()
                    .putRequest(
                        PutRequest.builder()
                            .item(tableSchema.itemToMap(viewed, true)).build()
                    )
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("viewed" to writeRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register viewed items", e)
        }
    }

    fun deleteViewed(userId: String, workId: Int): Viewed? {
        return try {
            val key =
                Key.builder().partitionValue(userId).sortValue(workId).build()
            table.deleteItem(key)
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete viewed item: userId=$userId, workId=$workId",
                e
            )
        }
    }
}