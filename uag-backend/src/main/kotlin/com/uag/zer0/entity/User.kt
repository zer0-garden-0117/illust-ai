package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "users")
data class User(
    @Id
    @DynamoDBHashKey(attributeName = "userId")
    var userId: String = "",

    @DynamoDBAttribute(attributeName = "userRole")
    var userRole: String = ""
)