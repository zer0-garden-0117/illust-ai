package com.ila.zer0.repository

import com.ila.zer0.entity.Product
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException

@Repository
class ProductRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()

    private val table =
        enhancedClient.table("product", TableSchema.fromClass(Product::class.java))

    private val logger = LoggerFactory.getLogger(ProductRepository::class.java)

    fun findByKey(userId: String, expiresKey: String): Product? {
        return try {
            table.getItem { r ->
                r.key(
                    Key.builder()
                        .partitionValue(userId)
                        .sortValue(expiresKey)
                        .build()
                )
            }
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to retrieve Product by key: userId=$userId, expiresKey=$expiresKey",
                e
            )
        }
    }

    fun putProduct(product: Product): Product {
        return try {
            table.putItem(product)
            product
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to put Product: key=(${product.userId}, ${product.expiresKey})",
                e
            )
        }
    }

    fun updateProduct(product: Product): Product {
        return try {
            table.updateItem(product)
            product
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to update Product: key=(${product.userId}, ${product.expiresKey})",
                e
            )
        }
    }

    fun deleteByKey(userId: String, expiresKey: String): Product {
        return try {
            table.deleteItem { r ->
                r.key(
                    Key.builder()
                        .partitionValue(userId)
                        .sortValue(expiresKey)
                        .build()
                )
            }
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete Product by key: userId=$userId, expiresKey=$expiresKey",
                e
            )
        }
    }

    /**
     * 期限範囲で絞り込み（[fromKey, toKey] を両端含む）。
     * 例: fromKey = "2025-10-01T00:00:00+09:00", toKey = "2025-12-31T23:59:59+09:00#~"
     */
    fun queryByRange(userId: String, fromKey: String, toKey: String): List<Product> {
        return try {
            val cond = QueryConditional.sortBetween(
                Key.builder().partitionValue(userId).sortValue(fromKey).build(),
                Key.builder().partitionValue(userId).sortValue(toKey).build()
            )
            val results = table.query { q -> q.queryConditional(cond) }
            results.items().toList()
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query Products by range: userId=$userId, fromKey=$fromKey, toKey=$toKey",
                e
            )
        }
    }

    /**
     * 現在以降（nowKey 以上）の有効なブーストを期限昇順で取得。
     * nowKey は expiresKey と同じフォーマット（例: "2025-10-15T19:00:00+09:00"）を推奨。
     */
    fun findActiveSince(userId: String, nowKey: String): List<Product> {
        return try {
            val cond = QueryConditional.sortGreaterThanOrEqualTo(
                Key.builder().partitionValue(userId).sortValue(nowKey).build()
            )
            val results = table.query { q -> q.queryConditional(cond) }
            results.items().toList()
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query active Products: userId=$userId, nowKey=$nowKey",
                e
            )
        }
    }

    /**
     * ユーザーの全ブーストを期限昇順で取得（最大件数を limit で制御）
     */
    fun listAllByUser(userId: String, limit: Int? = null): List<Product> {
        return try {
            val cond = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
            )
            val results = table.query { q ->
                q.queryConditional(cond)
                if (limit != null) q.limit(limit)
            }
            results.items().toList()
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to list Products for userId=$userId", e)
        }
    }
}