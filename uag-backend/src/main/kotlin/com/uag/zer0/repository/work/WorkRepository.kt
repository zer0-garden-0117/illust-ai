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

    fun findByWorkId(workId: Int): Work {
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

    fun findByGenre(genre: String): List<Work> {
        return try {
            val index = table.index("GenreIndex")
            val queryConditional =
                QueryConditional.keyEqualTo { key -> key.partitionValue(genre) }
            val results = index.query { r ->
                r.queryConditional(queryConditional)
                    .scanIndexForward(false)
            }
            val workList = mutableListOf<Work>()
            results.forEach { page ->
                workList.addAll(page.items())
            }
            workList
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to query by genre: $genre", e)
        }
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByGenreWithOffset(
        tag: String,
        offset: Int,
        limit: Int
    ): List<Work> {
        val index = table.index("GenreIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(tag).build()
        )
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        // 全件取得後に指定範囲をスキップしてフィルタ
        val works = mutableListOf<Work>()
        queryRequest.forEach { page ->
            works.addAll(page.items())
        }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return works.drop(offset).take(limit)
    }

    fun findByFormat(format: String): List<Work> {
        return try {
            val index = table.index("FormatIndex")
            val queryConditional =
                QueryConditional.keyEqualTo { key -> key.partitionValue(format) }
            val results = index.query { r ->
                r.queryConditional(queryConditional)
                    .scanIndexForward(false)
            }
            val workList = mutableListOf<Work>()
            results.forEach { page ->
                workList.addAll(page.items())
            }
            workList
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to query by format: $format", e)
        }
    }

    // offset：スキップ件数。例えば、offset = 10の場合、最初の10件をスキップ
    // limit：limit件数。例えば、limit = 10の場合、11件目から20件目までの10件を返す
    fun findByFormatWithOffset(
        tag: String,
        offset: Int,
        limit: Int
    ): List<Work> {
        val index = table.index("FormatIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(tag).build()
        )
        val queryRequest = index.query { r ->
            r.queryConditional(queryConditional)
                .scanIndexForward(false)
        }

        // 全件取得後に指定範囲をスキップしてフィルタ
        val works = mutableListOf<Work>()
        queryRequest.forEach { page ->
            works.addAll(page.items())
        }

        // offsetで指定した件数分スキップし、limit分だけ返す
        return works.drop(offset).take(limit)
    }

    fun registerWork(work: Work): Work {
        return try {
            table.putItem(work)
            work
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register work: ${work.workId}", e)
        }
    }
}