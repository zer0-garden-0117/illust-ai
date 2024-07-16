package com.uag.zer0.entity.user

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import java.io.Serializable

data class UserByLikedWorkId(
    @DynamoDBHashKey(attributeName = "userId")
    var userId: String? = null,

    @DynamoDBRangeKey(attributeName = "likedWorkId")
    var likedWorkId: String? = null
) : Serializable