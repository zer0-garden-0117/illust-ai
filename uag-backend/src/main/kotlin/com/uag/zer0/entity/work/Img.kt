package com.uag.zer0.entity.work

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey

@DynamoDbBean
data class Img(
    @get:DynamoDbPartitionKey
    var workId: Int = 0,

    @get:DynamoDbSortKey
    var imgUrl: String = "",

    @get:DynamoDbAttribute("imgPageNum")
    var imgPageNum: Int = 0,
)