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

# # テストデータ挿入
# echo "テストデータを挿入します..."

# # work テーブルのテストデータ
# put_item work '{
#     "workId": {"S": "deadbeef"},
#     "updatedAt": {"S": "2024-12-01T12:00:00Z"},
#     "mainTitle": {"S": "Sample Work"},
#     "subTitle": {"S": "A Great Piece of Work"},
#     "description": {"S": "This is a test description."},
#     "workSize": {"N": "500"},
#     "pages": {"N": "10"},
#     "titleImgUrl": {"S": "https://example.com/title.jpg"},
#     "thumbnailImgUrl": {"S": "https://example.com/thumbnail.jpg"},
#     "watermaskImgUrl": {"S": "https://example.com/watermask.jpg"},
#     "likes": {"N": "100"},
#     "downloads": {"N": "50"},
#     "createdAt": {"S": "2024-11-30T12:00:00Z"}
# }'

# # tag テーブルのテストデータ
# put_item tag '{
#     "workId": {"S": "deadbeef"},
#     "tag": {"S": "test-tag"},
#     "updatedAt": {"S": "2024-12-01T12:00:00Z"}
# }'

# # liked テーブルのテストデータ
# put_item liked '{
#     "userId": {"S": "testuser@example.com"},
#     "workId": {"S": "deadbeef"},
#     "updatedAt": {"S": "2024-12-01T12:00:00Z"}
# }'

# # rated テーブルのテストデータ
# put_item rated '{
#     "userId": {"S": "testuser@example.com"},
#     "workId": {"S": "deadbeef"},
#     "rating": {"N": "5"},
#     "updatedAt": {"S": "2024-12-01T12:00:00Z"}
# }'

# echo "テストデータの挿入が完了しました。"