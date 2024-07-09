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
    @DynamoDBHashKey(attributeName = "id")
    var id: String = "",

    @DynamoDBAttribute(attributeName = "title")
    var title: String = "",

    @DynamoDBAttribute(attributeName = "title_image_url")
    var titleImageUrl: String = "",

    @DynamoDBAttribute(attributeName = "creator")
    var creator: String = "",

    @DynamoDBAttribute(attributeName = "category")
    var category: String = "",

    @DynamoDBAttribute(attributeName = "subject")
    var subject: String = "",

    @DynamoDBAttribute(attributeName = "language")
    var language: String = "",

    @DynamoDBTypeConverted(converter = LocalDateTimeConverter::class)
    @DynamoDBAttribute(attributeName = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @DynamoDBTypeConverted(converter = LocalDateTimeConverter::class)
    @DynamoDBAttribute(attributeName = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @DynamoDBAttribute(attributeName = "page_count")
    var pageCount: Int = 0,

    @DynamoDBAttribute(attributeName = "likes")
    var likes: Int = 0,

    @DynamoDBAttribute(attributeName = "downloads")
    var downloads: Int = 0
)