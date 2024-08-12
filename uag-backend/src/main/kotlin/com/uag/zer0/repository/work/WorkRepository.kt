package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.Work
import org.springframework.stereotype.Repository
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient
import software.amazon.awssdk.enhanced.dynamodb.Key
import software.amazon.awssdk.enhanced.dynamodb.TableSchema
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException

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

    fun findByGenre(genre: String): List<Work> {
        return try {
            val index = table.index("GenreIndex")
            val queryConditional =
                QueryConditional.keyEqualTo { key -> key.partitionValue(genre) }

            val results = index.query(queryConditional)

            val workList = mutableListOf<Work>()
            results.forEach { page ->
                workList.addAll(page.items())
            }

            workList
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to query by genre: $genre", e)
        }
    }

    fun findByFormat(format: String): List<Work> {
        return try {
            val index = table.index("FormatIndex")
            val queryConditional =
                QueryConditional.keyEqualTo { key -> key.partitionValue(format) }

            val results = index.query(queryConditional)

            val workList = mutableListOf<Work>()
            results.forEach { page ->
                workList.addAll(page.items())
            }

            workList
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to query by format: $format", e)
        }
    }

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
}