package com.uag.zer0.entity.tag

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "tagByCategory")
data class TagByCategory(
    @Id
    var tagByCategoryId: TagByCategoryId? = null
) {
    @get:DynamoDBHashKey(attributeName = "tagName")
    var tagName: String?
        get() = tagByCategoryId?.tagName
        set(value) {
            if (tagByCategoryId == null) {
                tagByCategoryId = TagByCategoryId()
            }
            tagByCategoryId?.tagName = value
        }

    @get:DynamoDBRangeKey(attributeName = "categoryName")
    var categoryName: String?
        get() = tagByCategoryId?.categoryName
        set(value) {
            if (tagByCategoryId == null) {
                tagByCategoryId = TagByCategoryId()
            }
            tagByCategoryId?.categoryName = value
        }
}