package com.uag.zer0.entity.user

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "user")
data class User(
    @Id
    @DynamoDBHashKey(attributeName = "userId")
    var userId: String? = null,

    @DynamoDBAttribute(attributeName = "userRole")
    var userRole: String? = null
)