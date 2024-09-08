#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

export AWS_PAGER=""

# テーブルの作成関数
create_table() {
    local table_name=$1
    shift
    aws dynamodb create-table \
        --table-name $table_name \
        "$@" \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --endpoint-url $ENDPOINT_URL
}

# counters テーブルの作成
create_table counters \
    --attribute-definitions AttributeName=counterName,AttributeType=S \
    --key-schema AttributeName=counterName,KeyType=HASH

# work テーブルの作成
create_table work \
    --attribute-definitions \
        AttributeName=workId,AttributeType=N \
        AttributeName=genre,AttributeType=S \
        AttributeName=format,AttributeType=S \
        AttributeName=updatedAt,AttributeType=S \
    --key-schema \
        AttributeName=workId,KeyType=HASH \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"GenreIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"genre\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            },
            {
                \"IndexName\": \"FormatIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"format\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        ]"

# tag テーブルの作成
create_table tag \
    --attribute-definitions \
        AttributeName=workId,AttributeType=N \
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
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        ]"

# character テーブルの作成
create_table character \
    --attribute-definitions \
        AttributeName=workId,AttributeType=N \
        AttributeName=character,AttributeType=S \
        AttributeName=updatedAt,AttributeType=S \
    --key-schema \
        AttributeName=workId,KeyType=HASH \
        AttributeName=character,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"CharacterIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"character\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        ]"

# creator テーブルの作成
create_table creator \
    --attribute-definitions \
        AttributeName=workId,AttributeType=N \
        AttributeName=creator,AttributeType=S \
        AttributeName=updatedAt,AttributeType=S \
    --key-schema \
        AttributeName=workId,KeyType=HASH \
        AttributeName=creator,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"CreatorIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"creator\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        ]"

# img テーブルの作成
create_table img \
    --attribute-definitions \
        AttributeName=workId,AttributeType=N \
        AttributeName=imgUrl,AttributeType=S \
    --key-schema \
        AttributeName=workId,KeyType=HASH \
        AttributeName=imgUrl,KeyType=RANGE

# user テーブルの作成
create_table user \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH

# liked テーブルの作成
create_table liked \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=workId,AttributeType=N \
        AttributeName=updatedAt,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=workId,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"UserUpdatedAtIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        ]"

# viewed テーブルの作成
create_table viewed \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=workId,AttributeType=N \
        AttributeName=updatedAt,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=workId,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"UserViewedUpdatedAtIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"updatedAt\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        ]"

echo "すべてのテーブルが作成されました。"