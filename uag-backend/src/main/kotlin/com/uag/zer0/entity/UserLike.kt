package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "user_likes")
data class UserLike(
    @Id
    var userLikeId: UserLikeId? = null
) {
    @DynamoDBHashKey(attributeName = "userId")
    fun getUserId(): String? {
        return userLikeId?.userId
    }

    fun setUserId(userId: String) {
        if (userLikeId == null) {
            userLikeId = UserLikeId()
        }
        userLikeId?.userId = userId
    }

    @DynamoDBRangeKey(attributeName = "workId")
    fun getWorkId(): String? {
        return userLikeId?.workId
    }

    fun setWorkId(workId: String) {
        if (userLikeId == null) {
            userLikeId = UserLikeId()
        }
        userLikeId?.workId = workId
    }
}