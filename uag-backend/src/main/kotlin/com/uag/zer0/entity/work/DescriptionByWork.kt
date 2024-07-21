package com.uag.zer0.entity.work

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "descriptionByWork")
data class DescriptionByWork(
    @Id
    @DynamoDBHashKey(attributeName = "description")
    var description: String,

    var workId: String
)