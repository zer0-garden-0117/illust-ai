package com.uag.zer0.entity.work

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "mainTitleByWork")
data class MainTitleByWork(
    @Id
    @DynamoDBHashKey(attributeName = "mainTitle")
    var mainTitle: String,

    var workId: String
)