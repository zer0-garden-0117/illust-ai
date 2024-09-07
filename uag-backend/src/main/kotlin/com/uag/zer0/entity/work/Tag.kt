package com.uag.zer0.entity.work

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Tag(
    @get:DynamoDbPartitionKey
    var workId: Int = 0,

    @get:DynamoDbSortKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["TagIndex"])
    var tag: String = "",

    @get:DynamoDbSecondarySortKey(indexNames = ["TagIndex"])
    var updatedAt: Instant = Instant.now()
)