package com.uag.zer0.entity.user

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Viewed(
    @get:DynamoDbPartitionKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["UserViewedUpdatedAtIndex"])
    var userId: String = "",

    @get:DynamoDbSortKey
    @get:DynamoDbAttribute("workId")
    var workId: Int = 0,

    @get:DynamoDbSecondarySortKey(indexNames = ["UserViewedUpdatedAtIndex"])
    var updatedAt: Instant = Instant.now()
)