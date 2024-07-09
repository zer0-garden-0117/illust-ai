package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIndexHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable

@DynamoDBTable(tableName = "tags")
data class Tag(
    @DynamoDBHashKey(attributeName = "id")
    var id: String,
    @DynamoDBIndexHashKey(
        globalSecondaryIndexName = "name-index",
        attributeName = "name"
    )
    var name: String
)