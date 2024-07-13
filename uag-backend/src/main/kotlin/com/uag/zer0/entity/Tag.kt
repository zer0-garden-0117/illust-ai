package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable

@DynamoDBTable(tableName = "tags")
data class Tag(
    @DynamoDBHashKey(attributeName = "tagId")
    var tagId: String = "",

    @DynamoDBIndexHashKey(attributeName = "tagName")
    var tagName: String = ""
) {
    constructor() : this("", "")
}