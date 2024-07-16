package com.uag.zer0.entity.work

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "workByPage")
data class WorkByPage(
    @Id
    var workByPageId: WorkByPageId? = null,

    @DynamoDBAttribute(attributeName = "s3Url")
    var s3Url: String? = null
) {
    @get:DynamoDBHashKey(attributeName = "workId")
    var workId: String?
        get() = workByPageId?.workId
        set(value) {
            if (workByPageId == null) {
                workByPageId = WorkByPageId()
            }
            workByPageId?.workId = value
        }

    @get:DynamoDBRangeKey(attributeName = "pageNum")
    var pageNum: Int?
        get() = workByPageId?.pageNum
        set(value) {
            if (workByPageId == null) {
                workByPageId = WorkByPageId()
            }
            workByPageId?.pageNum = value
        }
}