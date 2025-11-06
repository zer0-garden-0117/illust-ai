package com.ila.zer0.repository

import com.ila.zer0.entity.Work
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
class WorkRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table("work", TableSchema.fromClass(Work::class.java))
    private val logger = LoggerFactory.getLogger(WorkRepository::class.java)

    fun findByWorkId(workId: String): Work {
        return try {
            val work = table.getItem { r ->
                r.key(
                    Key.builder().partitionValue(workId).build()
                )
            }
            work
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to retrieve work by workId: $workId",
                e
            )
        }
    }

    fun findByWorkIds(workIds: List<String>): List<Work> {
        if (workIds.isEmpty()) return emptyList()

        return try {
            // workId を DynamoDB のキー形式に変換
            val keys = workIds.map { workId ->
                mapOf(
                    "workId" to AttributeValue.builder().s(workId).build()
                )
            }

            val batchGetRequest = BatchGetItemRequest.builder()
                .requestItems(
                    mapOf(
                        "work" to KeysAndAttributes.builder()
                            .keys(keys)
                            .build()
                    )
                )
                .build()

            val response = dynamoDbClient.batchGetItem(batchGetRequest)

            // 取得した item を Work にマッピング
            val workItems = response.responses()["work"]?.map { item ->
                TableSchema.fromClass(Work::class.java).mapToItem(item)
            } ?: emptyList()

            workItems
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to batch get works by workIds: ${workIds.joinToString(",")}",
                e
            )
        }
    }

    fun findByUserId(userId: String): List<Work> {
        val index = table.index("UserIdIndex")
        val query = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(userId).build()
                    )
        val req = index.query { r ->
                r.queryConditional(query)
                 .scanIndexForward(false)
            }
        val works = mutableListOf<Work>()
        req.forEach { page -> works.addAll(page.items()) }
        return works
    }

    fun registerWork(work: Work): Work {
        return try {
            table.putItem(work)
            work
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register work: ${work.workId}", e)
        }
    }

    fun updateWork(work: Work): Work {
        return try {
            table.updateItem(work)
            work
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register work: ${work.workId}", e)
        }
    }

    fun deleteWorkById(workId: String) {
        try {
            table.deleteItem { r ->
                r.key(
                    Key.builder().partitionValue(workId).build()
                )
            }
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete work by workId: $workId",
                e
            )
        }
    }

    fun addLikes(workId: String): Work {
        val existingWork = findByWorkId(workId)
        existingWork.likes += 1
        return try {
            table.updateItem { req ->
                req.item(existingWork)
                req.ignoreNulls(true)
            }
            existingWork
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to addLikes work: $workId", e)
        }
    }

    fun deleteLikes(workId: String): Work {
        val existingWork = findByWorkId(workId)
        existingWork.likes -= 1
        return try {
            table.updateItem { req ->
                req.item(existingWork)
                req.ignoreNulls(true)
            }
            existingWork
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to deleteLikes work: $workId", e)
        }
    }

    fun addRating(workId: String, oldRate: Int?, newRate: Int): Work {
        require(newRate in 1..5) { "Rating must be between 1 and 5" }

        // 既存の作品を取得
        val existingWork = findByWorkId(workId)

        if (oldRate != null) {
            // 評価の更新ケース
            existingWork.rateSum = existingWork.rateSum - oldRate + newRate
            existingWork.rate = existingWork.rateSum.toDouble() / existingWork.rateCount
        } else {
            // 新規評価ケース
            existingWork.rateSum += newRate
            existingWork.rateCount += 1
            existingWork.rate = existingWork.rateSum.toDouble() / existingWork.rateCount
        }

        return try {
            table.updateItem { req ->
                req.item(existingWork)
                req.ignoreNulls(true)
            }
            existingWork
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to add rating to work: $workId", e)
        } catch (e: IllegalArgumentException) {
            throw RuntimeException("Invalid rating value: $newRate", e)
        }
    }
}