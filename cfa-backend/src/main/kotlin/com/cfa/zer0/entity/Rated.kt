package com.cfa.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Rated(
    @get:DynamoDbPartitionKey
    var userId: String = "",

    @get:DynamoDbSortKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["WorkIdIndex"])
    var workId: String = "",

    @get:DynamoDbAttribute("rating")
    var rating: Int = 0,

    @get:DynamoDbAttribute("updatedAt")
    var updatedAt: Instant = Instant.now()
)