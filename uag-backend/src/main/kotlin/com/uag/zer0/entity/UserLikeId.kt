package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import java.io.Serializable

@DynamoDBDocument
data class UserLikeId(
    @DynamoDBHashKey(attributeName = "userId")
    var userId: String? = null,

    @DynamoDBRangeKey(attributeName = "workId")
    var workId: String? = null
) : Serializable