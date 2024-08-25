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

    fun findWorkIdsByTag(tag: String): List<Int> {
        val index = table.index("TagIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(tag).build()
        )
        val results = index.query { r -> r.queryConditional(queryConditional) }
        val workIds = mutableListOf<Int>()
        results.forEach { page ->
            page.items().forEach { item ->
                workIds.add(item.workId)
            }
        }
        return workIds
    }

    fun findTagsByWorkId(workId: String): List<String> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(workId).build()
            )
            val results =
                table.query { r -> r.queryConditional(queryConditional) }
            val tags = mutableListOf<String>()
            results.forEach { page ->
                page.items().forEach { item ->
                    tags.add(item.tag)
                }
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