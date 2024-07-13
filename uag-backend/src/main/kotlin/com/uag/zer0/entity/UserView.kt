package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "user_views")
data class UserView(
    @Id
    var userViewId: UserViewId? = null
) {
    @DynamoDBHashKey(attributeName = "userId")
    fun getUserId(): String? {
        return userViewId?.userId
    }

    fun setUserId(userId: String) {
        if (userViewId == null) {
            userViewId = UserViewId()
        }
        userViewId?.userId = userId
    }

    @DynamoDBRangeKey(attributeName = "workId")
    fun getWorkId(): String? {
        return userViewId?.workId
    }

    fun setWorkId(workId: String) {
        if (userViewId == null) {
            userViewId = UserViewId()
        }
        userViewId?.workId = workId
    }
}