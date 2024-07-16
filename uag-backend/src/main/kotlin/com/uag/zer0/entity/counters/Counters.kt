package com.uag.zer0.entity.counters

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "counters")
data class Counters(
    @Id
    @DynamoDBHashKey(attributeName = "counterName")
    var counterName: String? = null,

    var counterValue: Long? = null
)