package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSecondaryPartitionKey
import java.time.Instant

@DynamoDbBean
data class User(
    @get:DynamoDbPartitionKey
    var userId: String = "",

    @get:DynamoDbSecondaryPartitionKey(indexNames = ["CustomUserIdIndex"])
    var customUserId: String = "",

    @get:DynamoDbAttribute("userName")
    var userName: String = "",

    @get:DynamoDbAttribute("updatedAt")
    var updatedAt: Instant = Instant.now(),

    @get:DynamoDbAttribute("follow")
    var follow: Int = 0,

    @get:DynamoDbAttribute("follower")
    var follower: Int = 0,

    @get:DynamoDbAttribute("userProfile")
    var userProfile: String = "",

    @get:DynamoDbAttribute("profileImageUrl")
    var profileImageUrl: String = "",

    @get:DynamoDbAttribute("coverImageUrl")
    var coverImageUrl: String = "",

    @get:DynamoDbAttribute("createdAt")
    var createdAt: Instant = Instant.now(),

    @get:DynamoDbAttribute("isFollowing")
    var isFollowing: Boolean = false,

    @get:DynamoDbAttribute("isFollowed")
    var isFollowed: Boolean = false,

    @get:DynamoDbAttribute("plan")
    var plan: String = "",

    @get:DynamoDbAttribute("boost")
    var boost: List<String> = emptyList(),

    @get:DynamoDbAttribute("illustNumLimit")
    var illustNumLimit: Int = 0,

    @get:DynamoDbAttribute("remainingIllustNum")
    var remainingIllustNum: Int = 0,

    @get:DynamoDbAttribute("viewRating")
    var viewRating: Int = 0,
)