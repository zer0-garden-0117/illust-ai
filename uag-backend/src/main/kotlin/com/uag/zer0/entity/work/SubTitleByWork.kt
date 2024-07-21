package com.uag.zer0.entity.work

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "subTitleByWork")
data class SubTitleByWork(
    @Id
    @DynamoDBHashKey(attributeName = "subTitle")
    var subTitle: String,

    var workId: String
)