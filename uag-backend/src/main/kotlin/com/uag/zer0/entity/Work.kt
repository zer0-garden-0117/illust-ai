package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted
import com.uag.zer0.converter.LocalDateTimeConverter
import org.springframework.data.annotation.Id
import java.time.LocalDateTime

@DynamoDBTable(tableName = "works")
data class Work(
    @Id
    @DynamoDBHashKey(attributeName = "workId")
    var workId: String = "",

    @DynamoDBAttribute(attributeName = "mainTitle")
    var mainTitle: String = "",

    @DynamoDBAttribute(attributeName = "subTitle")
    var subTitle: String = "",

    @DynamoDBAttribute(attributeName = "description")
    var description: String = "",

    @DynamoDBAttribute(attributeName = "workFormat")
    var workFormat: String = "",

    @DynamoDBAttribute(attributeName = "topicGenre")
    var topicGenre: String = "",

    @DynamoDBAttribute(attributeName = "creator")
    var creator: String = "",

    @DynamoDBAttribute(attributeName = "pages")
    var pages: String = "",

    @DynamoDBAttribute(attributeName = "workSize")
    var workSize: String = "",

    @DynamoDBAttribute(attributeName = "language")
    var language: String = "",

    @DynamoDBAttribute(attributeName = "likes")
    var likes: Int = 0,

    @DynamoDBAttribute(attributeName = "downloads")
    var downloads: Int = 0,

    @DynamoDBAttribute(attributeName = "titleImageUrl")
    var titleImageUrl: String = "",

    @DynamoDBTypeConverted(converter = LocalDateTimeConverter::class)
    @DynamoDBAttribute(attributeName = "createdAt")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @DynamoDBTypeConverted(converter = LocalDateTimeConverter::class)
    @DynamoDBAttribute(attributeName = "updatedAt")
    var updatedAt: LocalDateTime = LocalDateTime.now()
)