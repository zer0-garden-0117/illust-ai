package com.uag.zer0.repository.counters

import com.uag.zer0.entity.counters.Counters
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException

@Repository
class CountersRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table(
            "counters",
            TableSchema.fromClass(Counters::class.java)
        )

    fun findByCounterName(counterName: String): Int {
        return try {
            val counters = table.getItem { r ->
                r.key(
                    Key.builder().partitionValue(counterName).build()
                )
            }
            counters.counterValue
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to retrieve counterValue by counterName: $counterName",
                e
            )
        }
    }

    fun updateCounterValue(counterName: String, newValue: Int) {
        try {
            // 既存のカウンターを取得
            val counters = table.getItem { r ->
                r.key(Key.builder().partitionValue(counterName).build())
            }

            // カウンターの値を更新
            val updatedCounters = counters.copy(counterValue = newValue)

            // 更新されたカウンターを保存
            table.updateItem(updatedCounters)
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to update counterValue for counterName: $counterName",
                e
            )
        }
    }

    fun incrementCounterValue(counterName: String): Int {
        return try {
            val counters = table.getItem { r ->
                r.key(Key.builder().partitionValue(counterName).build())
            }
            val updatedValue = counters.counterValue + 1
            val updatedCounters = counters.copy(counterValue = updatedValue)
            table.updateItem(updatedCounters)
            updatedValue
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to increment counterValue for counterName: $counterName",
                e
            )
        }
    }
}