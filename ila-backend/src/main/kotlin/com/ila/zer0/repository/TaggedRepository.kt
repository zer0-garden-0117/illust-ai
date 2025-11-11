package com.ila.zer0.repository

import com.ila.zer0.entity.Follow
import com.ila.zer0.entity.Tagged
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException

@Repository
class TaggedRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()

    private val table =
        enhancedClient.table("tagged", TableSchema.fromClass(Tagged::class.java))

    private val logger = LoggerFactory.getLogger(TaggedRepository::class.java)

    fun existsByUserIdAndTag(userId: String, tag: String): Boolean {
        return try {
            val tagged = table.getItem { r ->
                r.key(
                    Key.builder()
                        .partitionValue(userId)
                        .sortValue(tag)
                        .build()
                )
            }
            tagged != null
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to check existence of tagged for userId: $userId and tag: $tag",
                e
            )
        }
    }

    fun findByUserId(userId: String): List<Tagged> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val results = table.query(queryConditional).items().toList()
            logger.info("Found ${results.size} follow items for userId=$userId")
            results
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to find follow items for userId=$userId",
                e
            )
        }
    }


    fun registerTagged(tagged: Tagged): Tagged {
        return try {
            table.putItem(tagged)
            tagged
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register tagged: userId=${tagged.userId}, tag=${tagged.tag}",
                e
            )
        }
    }

    fun updateTagged(tagged: Tagged): Tagged {
        return try {
            table.updateItem(tagged)
            tagged
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to update tagged: userId=${tagged.userId}, tag=${tagged.tag}",
                e
            )
        }
    }

    fun deleteTagged(userId: String, tag: String): Tagged {
        return try {
            table.deleteItem { r ->
                r.key(
                    Key.builder()
                        .partitionValue(userId)
                        .sortValue(tag)
                        .build()
                )
            }
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete tagged by userId: $userId and tag: $tag",
                e
            )
        }
    }

    fun deleteByUserId(userId: String) {
        try {
            val taggedList = findByUserId(userId)
            taggedList.forEach { tagged ->
                table.deleteItem { r ->
                    r.key(
                        Key.builder()
                            .partitionValue(tagged.userId)
                            .sortValue(tagged.tag)
                            .build()
                    )
                }
            }
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete tagged items by userId: $userId",
                e
            )
        }
    }
}