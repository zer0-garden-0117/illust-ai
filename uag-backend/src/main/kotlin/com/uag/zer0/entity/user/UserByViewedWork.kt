package com.uag.zer0.entity.user

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "userByViewedWork")
data class UserByViewedWork(
    @Id
    var userByViewedWorkId: UserByViewedWorkId? = null
) {
    @get:DynamoDBHashKey(attributeName = "userId")
    var userId: String?
        get() = userByViewedWorkId?.userId
        set(value) {
            if (userByViewedWorkId == null) {
                userByViewedWorkId = UserByViewedWorkId()
            }
            userByViewedWorkId?.userId = value
        }

    @get:DynamoDBRangeKey(attributeName = "viewedWorkId")
    var viewedWorkId: String?
        get() = userByViewedWorkId?.viewedWorkId
        set(value) {
            if (userByViewedWorkId == null) {
                userByViewedWorkId = UserByViewedWorkId()
            }
            userByViewedWorkId?.viewedWorkId = value
        }
}