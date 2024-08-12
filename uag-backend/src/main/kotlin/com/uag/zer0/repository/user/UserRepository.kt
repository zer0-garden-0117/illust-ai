package com.uag.zer0.repository.user

import com.uag.zer0.entity.user.User
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException

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

    fun findByUserId(userId: String): User? {
        return try {
            val queryConditional =
                QueryConditional.keyEqualTo { key -> key.partitionValue(userId) }

            val results = table.query(queryConditional)

            results.items().firstOrNull()
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to query by userId: $userId", e)
        }
    }
}