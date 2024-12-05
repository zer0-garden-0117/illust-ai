package com.uag.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey
import java.time.Instant

@DynamoDbBean
data class Rated(
    @get:DynamoDbPartitionKey
    var userId: String = "",

    @get:DynamoDbSortKey
    @get:DynamoDbAttribute("workId")
    var workId: String = "",

    @get:DynamoDbAttribute("rating")
    var rating: Int = 0,

    @get:DynamoDbAttribute("updatedAt")
    var updatedAt: Instant = Instant.now()
)