package com.uag.zer0.entity.work

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Creator(
    @get:DynamoDbPartitionKey
    var workId: Int = 0,

    @get:DynamoDbSortKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["CreatorIndex"])
    var creator: String = "",

    @get:DynamoDbSecondarySortKey(indexNames = ["CreatorIndex"])
    var updatedAt: Instant = Instant.now()
)