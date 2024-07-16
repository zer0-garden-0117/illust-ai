package com.uag.zer0.entity.tag

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import java.io.Serializable

data class TagByCategoryId(
    @DynamoDBHashKey(attributeName = "tagName")
    var tagName: String? = null,

    @DynamoDBRangeKey(attributeName = "categoryName")
    var categoryName: String? = null
) : Serializable