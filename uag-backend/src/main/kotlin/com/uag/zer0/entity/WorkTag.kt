package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "work_tags")
data class WorkTag(
    @Id
    var workTagId: WorkTagId? = null
) {
    @DynamoDBHashKey(attributeName = "work_id")
    fun getWorkId(): String? {
        return workTagId?.workId
    }

    fun setWorkId(workId: String) {
        if (workTagId == null) {
            workTagId = WorkTagId()
        }
        workTagId?.workId = workId
    }

    @DynamoDBRangeKey(attributeName = "tag_id")
    fun getTagId(): String? {
        return workTagId?.tagId
    }

    fun setTagId(tagId: String) {
        if (workTagId == null) {
            workTagId = WorkTagId()
        }
        workTagId?.tagId = tagId
    }
}