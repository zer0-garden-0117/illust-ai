package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable

@DynamoDBTable(tableName = "images")
data class Image(
    @DynamoDBHashKey(attributeName = "id")
    var id: String = "",

    @DynamoDBIndexHashKey(
        globalSecondaryIndexName = "work_id-index",
        attributeName = "work_id"
    )
    var workId: String = "",

    @DynamoDBAttribute(attributeName = "s3_url")
    var s3Url: String = ""
) {
    // デフォルトのコンストラクタ
    constructor() : this("", "", "")
}