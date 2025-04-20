#!/bin/bash

# config.sh を読み込む
source ./config.sh

export AWS_PAGER=""

# UUID生成関数
generate_uuid() {
    cat /proc/sys/kernel/random/uuid
}

# テーブルの作成関数（オンデマンド）
create_table() {
    local table_name=$1
    shift
    aws dynamodb create-table \
        --table-name "$table_name" \
        "$@" \
        --billing-mode PAY_PER_REQUEST \
        --endpoint-url "$ENDPOINT_URL"
}

# テーブルへのテストデータ挿入関数
put_item() {
    local table_name=$1
    local item_json=$2
    aws dynamodb put-item \
        --table-name "$table_name" \
        --item "$item_json" \
        --endpoint-url "$ENDPOINT_URL"
}

# work テーブルの作成
create_table work \
    --attribute-definitions \
        AttributeName=workId,AttributeType=S \
    --key-schema \
        AttributeName=workId,KeyType=HASH

# tag テーブルの作成
create_table tag \
    --attribute-definitions \
        AttributeName=workId,AttributeType=S \
        AttributeName=tag,AttributeType=S \
        AttributeName=updatedAt,AttributeType=S \
    --key-schema \
        AttributeName=workId,KeyType=HASH \
        AttributeName=tag,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"TagIndex\",
                 \"KeySchema\": [
                    {\"AttributeName\":\"tag\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"}
            }
        ]"

# liked テーブルの作成
create_table liked \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=workId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=workId,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"WorkIdIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"workId\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"}
            }
        ]"

# rated テーブルの作成
create_table rated \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=workId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=workId,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"WorkIdIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"workId\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"}
            }
        ]"

echo "すべてのテーブルがオンデマンド（PAY_PER_REQUEST）で作成されました。"