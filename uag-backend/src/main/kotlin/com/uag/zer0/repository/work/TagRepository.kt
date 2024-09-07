package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.Tag
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
class TagRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table("tag", TableSchema.fromClass(Tag::class.java))
    private val logger = LoggerFactory.getLogger(TagRepository::class.java)

    fun findByTag(tag: String): List<Tag> {
        val index = table.index("TagIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(tag).build()
        )
        val results = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }
        val tags = mutableListOf<Tag>()
        results.forEach { page ->
            tags.addAll(page.items())
        }
        return tags
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByTagWithOffset(tag: String, offset: Int, limit: Int): List<Tag> {
        val index = table.index("TagIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(tag).build()
        )
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        // 全件取得後に指定範囲をスキップしてフィルタ
        val tags = mutableListOf<Tag>()
        queryRequest.forEach { page ->
            tags.addAll(page.items())
        }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return tags.drop(offset).take(limit)
    }

    fun findByWorkId(workId: Int): List<Tag> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(workId).build()
            )
            val results =
                table.query { r -> r.queryConditional(queryConditional) }
            val tags = mutableListOf<Tag>()
            results.forEach { page ->
                tags.addAll(page.items())
            }
            tags
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to query tags by workId: $workId", e)
        }
    }

    fun registerTag(tag: Tag): Tag {
        return try {
            table.putItem(tag)
            tag
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register tag: ${tag.workId}", e)
        }
    }

    fun registerTags(tags: List<Tag>) {
        try {
            val tableSchema = TableSchema.fromClass(Tag::class.java)
            val writeRequests = tags.map { tag ->
                WriteRequest.builder()
                    .putRequest(
                        PutRequest.builder()
                            .item(tableSchema.itemToMap(tag, true)).build()
                    )
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("tag" to writeRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register tags", e)
        }
    }
}