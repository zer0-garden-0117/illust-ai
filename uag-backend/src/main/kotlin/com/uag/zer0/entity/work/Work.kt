package com.uag.zer0.entity.work

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSecondaryPartitionKey
import java.time.Instant

@DynamoDbBean
data class Work(
    @get:DynamoDbPartitionKey
    var workId: String = "",

    @get:DynamoDbSecondaryPartitionKey(indexNames = ["GenreIndex"])
    var genre: String? = null,

    @get:DynamoDbSecondaryPartitionKey(indexNames = ["FormatIndex"])
    var format: String? = null,

    var mainTitle: String = "",
    var subTitle: String = "",
    var description: String = "",

    @get:DynamoDbAttribute("workSize")
    var workSize: Int = 0,

    @get:DynamoDbAttribute("pages")
    var pages: Int = 0,

    @get:DynamoDbAttribute("titleImgUrl")
    var titleImgUrl: String = "",

    @get:DynamoDbAttribute("likes")
    var likes: Int = 0,

    @get:DynamoDbAttribute("downloads")
    var downloads: Int = 0,

    var createdAt: Instant = Instant.now(),
    var updatedAt: Instant = Instant.now()
)