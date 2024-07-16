package com.uag.zer0.entity.work

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import java.io.Serializable

data class WorkByTagId(
    @DynamoDBHashKey(attributeName = "workId")
    var workId: String? = null,

    @DynamoDBRangeKey(attributeName = "tagName")
    var tagName: String? = null
) : Serializable