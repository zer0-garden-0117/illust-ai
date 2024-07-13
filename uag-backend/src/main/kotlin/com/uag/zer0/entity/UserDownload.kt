package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "user_downloads")
data class UserDownload(
    @Id
    var userDownloadId: UserDownloadId? = null
) {
    @DynamoDBHashKey(attributeName = "userId")
    fun getUserId(): String? {
        return userDownloadId?.userId
    }

    fun setUserId(userId: String) {
        if (userDownloadId == null) {
            userDownloadId = UserDownloadId()
        }
        userDownloadId?.userId = userId
    }

    @DynamoDBRangeKey(attributeName = "workId")
    fun getWorkId(): String? {
        return userDownloadId?.workId
    }

    fun setWorkId(workId: String) {
        if (userDownloadId == null) {
            userDownloadId = UserDownloadId()
        }
        userDownloadId?.workId = workId
    }
}