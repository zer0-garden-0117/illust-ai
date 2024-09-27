package com.uag.zer0.entity.work

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*
import java.time.Instant

@DynamoDbBean
data class Work(
    @get:DynamoDbPartitionKey
    var workId: Int = 0,

    @get:DynamoDbSecondaryPartitionKey(indexNames = ["GenreIndex"])
    var genre: String = "",

    @get:DynamoDbSecondaryPartitionKey(indexNames = ["FormatIndex"])
    var format: String = "",

    @get:DynamoDbAttribute("mainTitle")
    var mainTitle: String = "",

    @get:DynamoDbAttribute("subTitle")
    var subTitle: String = "",

    @get:DynamoDbAttribute("description")
    var description: String = "",

    @get:DynamoDbAttribute("workSize")
    var workSize: Int = 0,

    @get:DynamoDbAttribute("pages")
    var pages: Int = 0,

    @get:DynamoDbAttribute("titleImgUrl")
    var titleImgUrl: String = "",

    @get:DynamoDbAttribute("thumbnailImgUrl")
    var thumbnailImgUrl: String = "",

    @get:DynamoDbAttribute("likes")
    var likes: Int = 0,

    @get:DynamoDbAttribute("downloads")
    var downloads: Int = 0,

    @get:DynamoDbAttribute("createdAt")
    var createdAt: Instant = Instant.now(),

    @get:DynamoDbSecondarySortKey(indexNames = ["GenreIndex", "FormatIndex"])
    var updatedAt: Instant = Instant.now()
)