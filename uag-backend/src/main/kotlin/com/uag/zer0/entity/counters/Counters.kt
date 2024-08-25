package com.uag.zer0.entity.counters

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey

@DynamoDbBean
data class Counters(
    @get:DynamoDbPartitionKey
    var counterName: String = "",

    @get:DynamoDbAttribute("counterValue")
    var counterValue: Int = 0
)