package com.uag.zer0.entity.tag

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import java.io.Serializable

data class TagByWorkId(
    @DynamoDBHashKey(attributeName = "tagName")
    var tagName: String? = null,

    @DynamoDBRangeKey(attributeName = "workId")
    var workId: String? = null
) : Serializable