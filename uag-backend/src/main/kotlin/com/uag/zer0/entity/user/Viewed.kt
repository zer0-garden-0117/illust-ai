package com.uag.zer0.entity.user

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*

@DynamoDbBean
data class Viewed(
    @get:DynamoDbPartitionKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["UserViewedUpdatedAtIndex"])
    var userId: String = "",

    @get:DynamoDbAttribute("workId")
    var workId: Int = 0,

    @get:DynamoDbSortKey
    @get:DynamoDbSecondarySortKey(indexNames = ["UserViewedUpdatedAtIndex"])
    var updatedAt: String = ""
)