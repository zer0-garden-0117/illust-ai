package com.uag.zer0.entity.user

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Liked(
    @get:DynamoDbPartitionKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["UserUpdatedAtIndex"])
    var userId: String = "",

    @get:DynamoDbSortKey
    @get:DynamoDbAttribute("workId")
    var workId: Int = 0,

    @get:DynamoDbSecondarySortKey(indexNames = ["UserUpdatedAtIndex"])
    var updatedAt: Instant = Instant.now()
)