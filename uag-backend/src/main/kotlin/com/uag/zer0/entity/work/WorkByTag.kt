package com.uag.zer0.entity.work

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "workByTag")
data class WorkByTag(
    @Id
    var workByTagId: WorkByTagId? = null
) {
    @get:DynamoDBHashKey(attributeName = "workId")
    var workId: String?
        get() = workByTagId?.workId
        set(value) {
            if (workByTagId == null) {
                workByTagId = WorkByTagId()
            }
            workByTagId?.workId = value
        }

    @get:DynamoDBRangeKey(attributeName = "tagName")
    var tagName: String?
        get() = workByTagId?.tagName
        set(value) {
            if (workByTagId == null) {
                workByTagId = WorkByTagId()
            }
            workByTagId?.tagName = value
        }
}