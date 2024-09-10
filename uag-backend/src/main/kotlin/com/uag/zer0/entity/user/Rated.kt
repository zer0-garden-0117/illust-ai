package com.uag.zer0.entity.user

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*

@DynamoDbBean
data class Rated(
    @get:DynamoDbPartitionKey
    @get:DynamoDbSecondaryPartitionKey(
        indexNames = ["UserUpdatedAtIndex", "UserRatingIndex"]
    )
    var userId: String = "",

    @get:DynamoDbAttribute("workId")
    var workId: Int = 0,

    @get:DynamoDbAttribute("rating")
    @get:DynamoDbSecondarySortKey(indexNames = ["UserRatingIndex"])
    var rating: Int = 0,

    @get:DynamoDbSortKey
    @get:DynamoDbSecondarySortKey(indexNames = ["UserUpdatedAtIndex"])
    var updatedAt: String = ""
)