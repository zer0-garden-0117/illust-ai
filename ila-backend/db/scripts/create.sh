#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
source "${SCRIPT_DIR}/config.sh"
export AWS_PAGER=""

# UUID生成関数
generate_uuid() {
    cat /proc/sys/kernel/random/uuid
}

# テーブル存在確認関数
table_exists() {
    local table_name=$1
    aws dynamodb describe-table \
        --profile "$PROFILE" \
        --table-name "$table_name" \
        --endpoint-url "$ENDPOINT_URL" \
        >/dev/null 2>&1
    return $?
}

# テーブルの作成関数（オンデマンド）
create_table() {
    local table_name=$1
    shift
    
    if table_exists "$table_name"; then
        echo "Table $table_name already exists. Skipping."
        return 0
    fi
    
    echo "Creating table $table_name..."
    aws dynamodb create-table \
        --profile "$PROFILE" \
        --table-name "$table_name" \
        "$@" \
        --billing-mode PAY_PER_REQUEST \
        --endpoint-url "$ENDPOINT_URL"
    
    # テーブルが作成されるのを待つ
    aws dynamodb wait table-exists \
        --profile "$PROFILE" \
        --table-name "$table_name" \
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

# user テーブルの作成
create_table user \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=customUserId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"CustomUserIdIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"customUserId\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"}
            }
        ]"


# follow テーブルの作成
create_table follow \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
        AttributeName=followUserId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
        AttributeName=followUserId,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"FollowUserIdIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"followUserId\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {\"ProjectionType\":\"ALL\"}
            }
        ]"

echo "Table creation process completed."