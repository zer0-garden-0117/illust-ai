package com.uag.zer0.repository.work

import com.uag.zer0.entity.work.Character
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
class CharacterRepository(
    private val dynamoDbClient: DynamoDbClient
) {
    private val enhancedClient: DynamoDbEnhancedClient =
        DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build()
    private val table =
        enhancedClient.table(
            "character",
            TableSchema.fromClass(Character::class.java)
        )
    private val logger =
        LoggerFactory.getLogger(CharacterRepository::class.java)

    fun findByCharacter(character: String): List<Character> {
        val index = table.index("CharacterIndex")
        val queryConditional = QueryConditional.keyEqualTo(
            Key.builder().partitionValue(character).build()
        )
        val results = index.query { r -> r.queryConditional(queryConditional) }
        val characters = mutableListOf<Character>()
        results.forEach { page ->
            characters.addAll(page.items())
        }
        return characters
    }

    // 指定された workId に関連するキャラクターのリストを取得するメソッド
    fun findByWorkId(workId: Int): List<Character> {
        return try {
            val queryConditional = QueryConditional.keyEqualTo(
                Key.builder().partitionValue(workId).build()
            )
            val results =
                table.query { r -> r.queryConditional(queryConditional) }
            val characters = mutableListOf<Character>()
            results.forEach { page ->
                characters.addAll(page.items())
            }
            characters
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to query character by workId: $workId",
                e
            )
        }
    }

    fun registerCharacter(character: Character): Character {
        return try {
            table.putItem(character)
            character
        } catch (e: DynamoDbException) {
            throw RuntimeException(
                "Failed to register character: ${character.workId}",
                e
            )
        }
    }

    fun registerCharacters(characters: List<Character>) {
        try {
            val tableSchema = TableSchema.fromClass(Character::class.java)
            val writeRequests = characters.map { character ->
                WriteRequest.builder()
                    .putRequest(
                        PutRequest.builder()
                            .item(tableSchema.itemToMap(character, true))
                            .build()
                    )
                    .build()
            }

            val batchWriteItemRequest = BatchWriteItemRequest.builder()
                .requestItems(mapOf("character" to writeRequests))
                .build()

            dynamoDbClient.batchWriteItem(batchWriteItemRequest)
        } catch (e: DynamoDbException) {
            throw RuntimeException("Failed to register characters", e)
        }
    }
}