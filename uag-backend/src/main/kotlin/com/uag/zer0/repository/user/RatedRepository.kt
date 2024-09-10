package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.Rated
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
            val index = table.index("UserUpdatedAtIndex")
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val queryRequest = index.query { r ->
                r.queryConditional(queryConditional)
                    .scanIndexForward(false)  // updatedAtで降順にソート
            }

            val ratedItems = mutableListOf<Rated>()
            queryRequest.forEach { page ->
                ratedItems.addAll(page.items())
            }
            ratedItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query rated items by userId with updatedAt: $userId",
                e
            )
        }
    }

    fun findByUserIdsAndWorkIds(ids: List<Pair<String, Int>>): List<Rated> {
        return try {
            val keys = ids.map { (userId, workId) ->
                mapOf(
                    "userId" to AttributeValue.builder().s(userId).build(),
                    "workId" to AttributeValue.builder().n(workId.toString())
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

    fun findByUserIdWithSpecificRating(
        userId: String,
        rating: Int
    ): List<Rated> {
        return try {
            val index = table.index("UserRatingIndex")
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).sortValue(rating).build()
            )
            val queryRequest = index.query { r ->
                r.queryConditional(queryConditional)
            }

            val ratedItems = mutableListOf<Rated>()
            queryRequest.forEach { page ->
                ratedItems.addAll(page.items())
            }
            ratedItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query rated items by userId: $userId with specific rating: $rating",
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

    fun deleteRated(userId: String, workId: Int): Rated {
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