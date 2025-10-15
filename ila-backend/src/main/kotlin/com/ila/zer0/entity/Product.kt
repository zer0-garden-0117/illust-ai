package com.ila.zer0.entity

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbSortKey

@DynamoDbBean
data class Product(
    // パーティションキー: ユーザーID
    @get:DynamoDbPartitionKey
    var userId: String = "",

    // ソートキー: 有効期限＋UUID（例: 2025-11-11T00:00:00Z#UUID）
    @get:DynamoDbSortKey
    var expiresKey: String = "",

    // TTL（自動削除用、epoch 秒）
    @get:DynamoDbAttribute("ttl")
    var ttl: Long? = null,

    // プロダクトの種類
    @get:DynamoDbAttribute("product")
    var product: String = "",

    // 有効期限
    @get:DynamoDbAttribute("supportTo")
    var supportTo: String = "",

    // 自動更新日
    @get:DynamoDbAttribute("autoUpdateTo")
    var autoUpdateTo: String? = null,

    // 作成日時（ISO8601形式）
    @get:DynamoDbAttribute("createdAt")
    var createdAt: String? = null,
)