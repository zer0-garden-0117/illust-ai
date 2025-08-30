package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import java.time.Instant

@DynamoDbBean
data class User(
    @get:DynamoDbPartitionKey
    var userId: String = "",

    @get:DynamoDbAttribute("customUserId")
    var customUserId: String = "",

    @get:DynamoDbAttribute("updatedAt")
    var updatedAt: Instant = Instant.now(),

    @get:DynamoDbAttribute("userProfile")
    var userProfile: String = "",

    @get:DynamoDbAttribute("profileImageUrl")
    var profileImageUrl: String = "",

    @get:DynamoDbAttribute("createdAt")
    var createdAt: Instant = Instant.now()
)