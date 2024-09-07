package com.uag.zer0.entity.user

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*

@DynamoDbBean
data class Liked(
    @get:DynamoDbPartitionKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["UserUpdatedAtIndex"])
    var userId: String = "",

    @get:DynamoDbAttribute("workId")
    var workId: Int = 0,

    @get:DynamoDbSortKey
    @get:DynamoDbSecondarySortKey(indexNames = ["UserUpdatedAtIndex"])
    var updatedAt: String = ""
)