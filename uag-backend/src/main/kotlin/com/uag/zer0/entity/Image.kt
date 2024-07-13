package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable

@DynamoDBTable(tableName = "images")
data class Image(
    @DynamoDBHashKey(attributeName = "imgId")
    var imgId: String = "",

    @DynamoDBIndexHashKey(
        globalSecondaryIndexName = "workId-index",
        attributeName = "workId"
    )
    var workId: String = "",

    @DynamoDBAttribute(attributeName = "s3Url")
    var s3Url: String = "",

    @DynamoDBAttribute(attributeName = "pageNumber")
    var pageNumber: Int = 0
) {
    // デフォルトのコンストラクタ
    constructor() : this("", "", "", 0)
}