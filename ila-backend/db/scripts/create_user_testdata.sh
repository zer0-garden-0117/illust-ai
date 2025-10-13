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

# userテーブルにデータが既に存在するか確認
if check_items_exist user; then
    echo "Test data already exists in user table. Exiting script."
    exit 0
fi

# userテーブルにテストデータを追加
echo "Adding test data to user table..."

#put_item user '{
#  "userId": {"S": "user001"},
#  "customUserId": {"S": "xxx"},
#  "updatedAt": {"S": "2024-01-15T10:30:00Z"},
#  "userName": {"S": "testUserName"},
#  "userProfile": {"S": "testUserProfile"},
#  "profileImageUrl": {"S": "https://ila-backend.s3.us-east-2.amazonaws.com/icon2.png"},
#  "coverImageUrl": {"S": "https://ila-backend.s3.us-east-2.amazonaws.com/cover2.png"},
#  "createdAt": {"S": "2023-05-10T14:20:00Z"}
#}'
#
#put_item user '{
#  "userId": {"S": "user002"},
#  "customUserId": {"S": "yyy"},
#  "updatedAt": {"S": "2024-01-15T10:30:00Z"},
#  "userName": {"S": "testUserName"},
#  "userProfile": {"S": "testUserProfile"},
#  "profileImageUrl": {"S": "https://ila-backend.s3.us-east-2.amazonaws.com/icon2.png"},
#  "coverImageUrl": {"S": "https://ila-backend.s3.us-east-2.amazonaws.com/cover2.png"},
#  "createdAt": {"S": "2023-05-10T14:20:00Z"}
#}'
#
#put_item user '{
#  "userId": {"S": "user003"},
#  "customUserId": {"S": "zzz"},
#  "updatedAt": {"S": "2024-01-15T10:30:00Z"},
#  "userName": {"S": "testUserName"},
#  "userProfile": {"S": "testUserProfile"},
#  "profileImageUrl": {"S": "https://ila-backend.s3.us-east-2.amazonaws.com/icon2.png"},
#  "coverImageUrl": {"S": "https://ila-backend.s3.us-east-2.amazonaws.com/cover2.png"},
#  "createdAt": {"S": "2023-05-10T14:20:00Z"}
#}'

for i in $(seq 1 5); do
  printf -v padded "%03d" "$i"   # 001, 002, ... 050
  put_item user "{
    \"userId\": {\"S\": \"user${padded}\"},
    \"customUserId\": {\"S\": \"${padded}\"},
    \"updatedAt\": {\"S\": \"2024-01-15T10:30:00Z\"},
    \"userName\": {\"S\": \"testUserName\"},
    \"userProfile\": {\"S\": \"testUserProfile\"},
    \"profileImageUrl\": {\"S\": \"https://ila-backend.s3.us-east-2.amazonaws.com/icon2.png\"},
    \"coverImageUrl\": {\"S\": \"https://ila-backend.s3.us-east-2.amazonaws.com/cover2.png\"},
    \"createdAt\": {\"S\": \"2023-05-10T14:20:00Z\"},
    \"plan\": {\"S\": \"Free\"},
    \"boost\": {\"L\": [{\"S\": \"Boost S:2025/10/17\"}, {\"S\": \"Boost M:2025/11/11\"}]},
    \"illustNum\": {\"N\": \"3\"}
  }"
done

echo "Test data insertion completed."