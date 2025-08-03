package com.cfa.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey
import java.time.Instant

@DynamoDbBean
data class Work(
    @get:DynamoDbPartitionKey
    var workId: String = "",

    @get:DynamoDbAttribute("updatedAt")
    var updatedAt: Instant = Instant.now(),

    @get:DynamoDbAttribute("mainTitle")
    var mainTitle: String = "",

    @get:DynamoDbAttribute("subTitle")
    var subTitle: String = "",

    @get:DynamoDbAttribute("description")
    var description: String = "",

    @get:DynamoDbAttribute("prompt")
    var prompt: String = "",

    @get:DynamoDbAttribute("titleImgUrl")
    var titleImgUrl: String = "",

    @get:DynamoDbAttribute("thumbnailImgUrl")
    var thumbnailImgUrl: String = "",

    @get:DynamoDbAttribute("watermaskImgUrl")
    var watermaskImgUrl: String = "",

    @get:DynamoDbAttribute("likes")
    var likes: Int = 0,

    @get:DynamoDbAttribute("rateSum")
    var rateSum: Int = 0,

    @get:DynamoDbAttribute("rateCount")
    var rateCount: Int = 0,

    @get:DynamoDbAttribute("rate")
    var rate: Double = 0.0,
    
    @get:DynamoDbAttribute("createdAt")
    var createdAt: Instant = Instant.now()
)