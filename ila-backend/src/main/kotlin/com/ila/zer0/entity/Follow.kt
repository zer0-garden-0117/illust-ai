package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Follow(
    @get:DynamoDbPartitionKey
    var userId: String = "",

    @get:DynamoDbSortKey
    @get:DynamoDbSecondaryPartitionKey(indexNames = ["FollowUserIdIndex"])
    var followUserId: String = "",

    @get:DynamoDbSecondarySortKey(indexNames = ["FollowUserIdIndex"])
    var updatedAt: Instant = Instant.now()
)