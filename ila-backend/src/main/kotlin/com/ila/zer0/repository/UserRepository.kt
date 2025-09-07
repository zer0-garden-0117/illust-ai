package com.ila.zer0.repository

import com.ila.zer0.entity.Tag
import com.ila.zer0.entity.User
import com.ila.zer0.entity.Work
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.enhanced.dynamodb.model.UpdateItemEnhancedRequest
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException
import java.time.Instant

@Repository
class UserRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table("user", TableSchema.fromClass(User::class.java))
    private val logger = LoggerFactory.getLogger(UserRepository::class.java)

    fun findByUserId(userId: String): User? {
        return try {
            val user = table.getItem { r ->
                r.key(
                    Key.builder().partitionValue(userId).build()
                )
            }
            user
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to retrieve user by userId: $userId",
                e
            )
        }
    }

    fun findByCustomUserId(customUserId: String): User? {
        val index = table.index("CustomUserIdIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(customUserId).build()
        )

        val results = index.query { r ->
            r.queryConditional(queryConditional)
                .limit(1)
        }

        for (page in results) {
            return page.items().firstOrNull()
        }
        return null
    }

    fun existsByCustomUserId(customUserId: String): Boolean {
        return findByCustomUserId(customUserId) != null
    }

    fun registerUser(user: User): User {
        return try {
            table.putItem(user)
            user
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register user: ${user.userId}", e)
        }
    }

    fun updateUser(user: User): User {
        return try {
            table.updateItem(user)
            user
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register user: ${user.userId}", e)
        }
    }

    fun deleteUserById(userId: String): User {
        return try {
            table.deleteItem { r ->
                r.key(
                    Key.builder().partitionValue(userId).build()
                )
            }
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete user by userId: $userId",
                e
            )
        }
    }
}