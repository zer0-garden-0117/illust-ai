package com.uag.zer0.entity.work

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Character(
    @get:DynamoDbPartitionKey
    var workId: Int = 0,

    @get:DynamoDbSortKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["CharacterIndex"])
    var character: String = "",

    @get:DynamoDbSecondarySortKey(indexNames = ["CharacterIndex"])
    var updatedAt: Instant = Instant.now()
)