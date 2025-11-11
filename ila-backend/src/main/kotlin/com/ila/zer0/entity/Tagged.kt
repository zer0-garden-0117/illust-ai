package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey
import java.time.Instant

@DynamoDbBean
data class Tagged(
    @get:DynamoDbPartitionKey
    var userId: String = "",

    @get:DynamoDbSortKey
    var tag: String = "",

    @get:DynamoDbAttribute("updatedAt")
    var updatedAt: Instant = Instant.now(),

    @get:DynamoDbAttribute("order")
    var order: Int = 0
)