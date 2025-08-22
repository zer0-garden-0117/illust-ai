package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Tag(
    @get:DynamoDbPartitionKey
    var workId: String = "",

    @get:DynamoDbSortKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["TagIndex"])
    var tag: String = "",

    @get:DynamoDbSecondarySortKey(indexNames = ["TagIndex"])
    var updatedAt: Instant = Instant.now()
)