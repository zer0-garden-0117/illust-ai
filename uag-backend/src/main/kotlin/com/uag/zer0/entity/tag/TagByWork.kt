package com.uag.zer0.entity.tag

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "tagByWork")
data class TagByWork(
    @Id
    var tagByWorkId: TagByWorkId? = null
) {
    @get:DynamoDBHashKey(attributeName = "tagName")
    var tagName: String?
        get() = tagByWorkId?.tagName
        set(value) {
            if (tagByWorkId == null) {
                tagByWorkId = TagByWorkId()
            }
            tagByWorkId?.tagName = value
        }

    @get:DynamoDBRangeKey(attributeName = "workId")
    var workId: String?
        get() = tagByWorkId?.workId
        set(value) {
            if (tagByWorkId == null) {
                tagByWorkId = TagByWorkId()
            }
            tagByWorkId?.workId = value
        }
}