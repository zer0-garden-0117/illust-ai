package com.ila.zer0.repository

import com.ila.zer0.entity.Tag
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*

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
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        val tags = mutableListOf<Tag>()
        queryRequest.forEach { page ->
            tags.addAll(page.items())
        }
        return tags
    }

    fun findByWorkId(workId: String): List<Tag> {
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

    fun deleteTagByWorkId(workId: String) {
        try {
            // workId が数値に変換できるか確認し、適切な型で保存
            val workIdAttribute = workId.toIntOrNull()?.let {
                AttributeValue.builder().n(it.toString()).build()
            } ?: AttributeValue.builder().s(workId).build()

            val tagsToDelete = findByWorkId(workId) // 対象のタグを取得
            val deleteRequests = tagsToDelete.map { tag ->
                WriteRequest.builder()
                    .deleteRequest { dr ->
                        dr.key(
                            mapOf(
                                "workId" to workIdAttribute,  // 型を適切にセット
                                "tag" to AttributeValue.builder().s(tag.tag)
                                    .build()
                            )
                        )
                    }
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("tag" to deleteRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to delete tags by workId: $workId",
                e
            )
        }
    }
}