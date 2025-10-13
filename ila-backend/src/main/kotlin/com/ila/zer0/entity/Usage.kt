package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey

@DynamoDbBean
data class Usage(
    // パーティションキー: ユーザーID
    @get:DynamoDbPartitionKey
    var userId: String = "",

    // ソートキー: 日付 (yyyymmdd)
    @get:DynamoDbSortKey
    var yyyymmdd: String = "",

    // 当日使用回数
    @get:DynamoDbAttribute("usedCount")
    var usedCount: Int = 0,

    // 当日上限 (Boost やプラン適用後の上限値)
    @get:DynamoDbAttribute("limit")
    var limit: Int = 5,

    // 自動削除用 TTL（epoch 秒）
    @get:DynamoDbAttribute("ttl")
    var ttl: Long? = null,
)