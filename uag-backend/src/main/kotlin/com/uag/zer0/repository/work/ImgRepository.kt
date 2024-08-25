package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.Img
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
class ImgRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table(
            "img",
            TableSchema.fromClass(Img::class.java)
        )
    private val logger =
        LoggerFactory.getLogger(ImgRepository::class.java)

    // 指定された workId に関連するImgのリストを取得するメソッド
    fun findImgUrlsByWorkId(workId: String): List<String> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(workId).build()
            )
            val results =
                table.query { r -> r.queryConditional(queryConditional) }
            val imgs = mutableListOf<String>()
            results.forEach { page ->
                page.items().forEach { item ->
                    imgs.add(item.imgUrl)
                }
            }
            imgs
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query imgUrls by workId: $workId",
                e
            )
        }
    }

    fun registerImg(img: Img): Img {
        return try {
            table.putItem(img)
            img
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register img: ${img.workId}", e)
        }
    }

    fun registerImgs(imgs: List<Img>) {
        try {
            val tableSchema =
                TableSchema.fromClass(Img::class.java)
            val writeRequests = imgs.map { img ->
                WriteRequest.builder()
                    .putRequest(
                        PutRequest.builder()
                            .item(tableSchema.itemToMap(img, true)).build()
                    )
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("img" to writeRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register images", e)
        }
    }
}