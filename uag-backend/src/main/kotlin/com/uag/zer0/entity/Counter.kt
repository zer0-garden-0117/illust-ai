package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable

@DynamoDBTable(tableName = "Counter")
data class Counter(
    @DynamoDBHashKey(attributeName = "CounterName")
    var counterName: String = "",
    var value: Long = 0
)