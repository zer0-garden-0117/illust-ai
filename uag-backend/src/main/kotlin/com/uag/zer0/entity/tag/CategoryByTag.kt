package com.uag.zer0.entity.tag

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable
import org.springframework.data.annotation.Id

@DynamoDBTable(tableName = "categoryByTag")
data class CategoryByTag(
    @Id
    var categoryByTagId: CategoryByTagId? = null
) {
    @get:DynamoDBHashKey(attributeName = "categoryName")
    var categoryName: String?
        get() = categoryByTagId?.categoryName
        set(value) {
            if (categoryByTagId == null) {
                categoryByTagId = CategoryByTagId()
            }
            categoryByTagId?.categoryName = value
        }

    @get:DynamoDBRangeKey(attributeName = "tagName")
    var tagName: String?
        get() = categoryByTagId?.tagName
        set(value) {
            if (categoryByTagId == null) {
                categoryByTagId = CategoryByTagId()
            }
            categoryByTagId?.tagName = value
        }
}