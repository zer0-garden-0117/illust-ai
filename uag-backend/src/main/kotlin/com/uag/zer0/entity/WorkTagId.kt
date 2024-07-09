package com.uag.zer0.entity

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import java.io.Serializable

data class WorkTagId(
    @DynamoDBHashKey(attributeName = "work_id")
    var workId: String = "",

    @DynamoDBRangeKey(attributeName = "tag_id")
    var tagId: String = ""
) : Serializable