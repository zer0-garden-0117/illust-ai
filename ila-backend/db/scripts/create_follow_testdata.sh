#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
source "${SCRIPT_DIR}/config.sh"
export AWS_PAGER=""

# テーブルへのテストデータ挿入関数
put_item() {
    local table_name=$1
    local item_json=$2
    aws dynamodb put-item \
        --profile "$PROFILE" \
        --table-name "$table_name" \
        --item "$item_json" \
        --endpoint-url "$ENDPOINT_URL"
}

check_items_exist() {
    local table_name=$1
    local count=$(aws dynamodb scan \
        --profile "$PROFILE" \
        --table-name "$table_name" \
        --select "COUNT" \
        --endpoint-url "$ENDPOINT_URL" \
        --query "Count" \
        --output text)
    if [ "$count" -gt 0 ]; then
        return 0  # アイテムが存在する
    else
        return 1  # アイテムが存在しない
    fi
}

# follow テーブルにデータが既に存在するか確認
if check_items_exist follow; then
    echo "Test data already exists in tag table. Exiting script."
    exit 0
fi

# follow テーブルにテストデータを追加
echo "Adding test data to follow table..."

put_item follow '{
  "userId": {"S": "user001"},
  "followUserId": {"S": "user002"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item follow '{
  "userId": {"S": "user001"},
  "followUserId": {"S": "user003"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

echo "Tag table test data insertion completed."