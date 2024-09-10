package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.Liked
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

    fun findByUserIdsAndWorkIds(ids: List<Pair<String, Int>>): List<Liked> {
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

    fun deleteLiked(userId: String, workId: Int): Liked {
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