package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.Creator
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
class CreatorRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table(
            "creator",
            TableSchema.fromClass(Creator::class.java)
        )
    private val logger =
        LoggerFactory.getLogger(CreatorRepository::class.java)

    fun findByCreator(creator: String): List<Creator> {
        val index = table.index("CreatorIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(creator).build()
        )
        val results = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }
        val creators = mutableListOf<Creator>()
        results.forEach { page ->
            creators.addAll(page.items())
        }
        return creators
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByCreatorWithOffset(
        tag: String,
        offset: Int,
        limit: Int
    ): List<Creator> {
        val index = table.index("CreatorIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(tag).build()
        )
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        // 全件取得後に指定範囲をスキップしてフィルタ
        val creators = mutableListOf<Creator>()
        queryRequest.forEach { page ->
            creators.addAll(page.items())
        }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return creators.drop(offset).take(limit)
    }

    fun findByWorkId(workId: Int): List<Creator> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(workId).build()
            )
            val results =
                table.query { r -> r.queryConditional(queryConditional) }
            val creators = mutableListOf<Creator>()
            results.forEach { page ->
                creators.addAll(page.items())
            }
            creators
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query creator by workId: $workId",
                e
            )
        }
    }

    fun registerCreator(creator: Creator): Creator {
        return try {
            table.putItem(creator)
            creator
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register creator: ${creator.workId}",
                e
            )
        }
    }

    fun registerCreators(creators: List<Creator>) {
        try {
            val tableSchema = TableSchema.fromClass(Creator::class.java)
            val writeRequests = creators.map { creator ->
                WriteRequest.builder()
                    .putRequest(
                        PutRequest.builder()
                            .item(tableSchema.itemToMap(creator, true)).build()
                    )
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("creator" to writeRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register creators", e)
        }
    }
}