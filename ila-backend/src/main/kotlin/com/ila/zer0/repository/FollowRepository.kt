package com.ila.zer0.repository

import com.ila.zer0.entity.Follow
import com.ila.zer0.entity.Tag
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException

@Repository
class FollowRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table("follow", TableSchema.fromClass(Follow::class.java))
    private val logger = LoggerFactory.getLogger(FollowRepository::class.java)

    // 指定したユーザーがフォローしているユーザーのリストを取得する
    fun findByUserId(userId: String): List<Follow> {
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

    // 指定したユーザーがフォローされているユーザーのリストを取得する
    fun findByFollowUserId(followUserId: String): List<Follow> {
        logger.info("Finding follow items for followUserId=$followUserId")
        val index = table.index("FollowUserIdIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(followUserId).build()
        )
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        val follows = mutableListOf<Follow>()
        queryRequest.forEach { page ->
            follows.addAll(page.items())
        }
        logger.info("Found ${follows.size} follow items for followUserId=$followUserId")
        return follows
    }

    fun registerFollow(follow: Follow): Follow {
        return try {
            table.putItem(follow)
            logger.info("Registered follow: userId=${follow.userId}, followUserId=${follow.followUserId}")
            follow
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register follow: userId=${follow.userId}, followUserId=${follow.followUserId}",
                e
            )
        }
    }

    fun deleteFollow(userId: String, followUserId: String): Follow {
        return try {
            val key = Key.builder()
                .partitionValue(userId)
                .sortValue(followUserId)
                .build()
            val deletedItem = table.deleteItem(key)
            logger.info("Deleted follow: userId=$userId, followUserId=$followUserId")
            deletedItem
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete follow: userId=$userId, followUserId=$followUserId",
                e
            )
        }
    }

    // 指定したユーザーがフォローしているすべての関係を削除する
    fun deleteAllByUserId(userId: String) {
        try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val items = table.query(queryConditional).items().toList()

            items.forEach { follow ->
                val key = Key.builder()
                    .partitionValue(follow.userId)
                    .sortValue(follow.followUserId)
                    .build()
                table.deleteItem(key)
                logger.info("Deleted follow: userId=${follow.userId}, followUserId=${follow.followUserId}")
            }

            logger.info("Deleted ${items.size} follow items for userId=$userId")
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete follow items for userId=$userId",
                e
            )
        }
    }
}