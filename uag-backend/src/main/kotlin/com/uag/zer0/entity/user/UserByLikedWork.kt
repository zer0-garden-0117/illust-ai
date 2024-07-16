package com.uag.zer0.entity.user

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "userByLikedWork")
data class UserByLikedWork(
    @Id
    var userByLikedWorkId: UserByLikedWorkId? = null
) {
    @get:DynamoDBHashKey(attributeName = "userId")
    var userId: String?
        get() = userByLikedWorkId?.userId
        set(value) {
            if (userByLikedWorkId == null) {
                userByLikedWorkId = UserByLikedWorkId()
            }
            userByLikedWorkId?.userId = value
        }

    @get:DynamoDBRangeKey(attributeName = "likedWorkId")
    var likedWorkId: String?
        get() = userByLikedWorkId?.likedWorkId
        set(value) {
            if (userByLikedWorkId == null) {
                userByLikedWorkId = UserByLikedWorkId()
            }
            userByLikedWorkId?.likedWorkId = value
        }
}