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

# tagテーブルにデータが既に存在するか確認
if check_items_exist tag; then
    echo "Test data already exists in tag table. Exiting script."
    exit 0
fi

# tagテーブルにテストデータを追加
echo "Adding test data to tag table..."

# jahMEp6J のタグデータ
put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "character_零崎くるみ"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "creator_tester"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "format_"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "genre_illustration"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "other_2024"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "other_GLOBAL"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

put_item tag '{
  "workId": {"S": "jahMEp6J"},
  "tag": {"S": "other_Xmas"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"}
}'

# xERd9FNW のタグデータ
put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "character_零崎鈴"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "creator_tester"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "format_"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "genre_illustration"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "other_2025"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "other_GLOBAL"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "other_happy new year"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

put_item tag '{
  "workId": {"S": "xERd9FNW"},
  "tag": {"S": "other_あけおめ"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"}
}'

# t_5XgsVa のタグデータ
put_item tag '{
  "workId": {"S": "t_5XgsVa"},
  "tag": {"S": "character_その他"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"}
}'

put_item tag '{
  "workId": {"S": "t_5XgsVa"},
  "tag": {"S": "creator_tester"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"}
}'

put_item tag '{
  "workId": {"S": "t_5XgsVa"},
  "tag": {"S": "format_"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"}
}'

put_item tag '{
  "workId": {"S": "t_5XgsVa"},
  "tag": {"S": "genre_icon"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"}
}'

put_item tag '{
  "workId": {"S": "t_5XgsVa"},
  "tag": {"S": "other_GLOBAL"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"}
}'

put_item tag '{
  "workId": {"S": "t_5XgsVa"},
  "tag": {"S": "other_白背景"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"}
}'

# EK4UpOm4 のタグデータ
put_item tag '{
  "workId": {"S": "EK4UpOm4"},
  "tag": {"S": "character_零崎真白"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"}
}'

put_item tag '{
  "workId": {"S": "EK4UpOm4"},
  "tag": {"S": "creator_tester"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"}
}'

put_item tag '{
  "workId": {"S": "EK4UpOm4"},
  "tag": {"S": "format_"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"}
}'

put_item tag '{
  "workId": {"S": "EK4UpOm4"},
  "tag": {"S": "genre_illustration"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"}
}'

put_item tag '{
  "workId": {"S": "EK4UpOm4"},
  "tag": {"S": "other_GLOBAL"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"}
}'

put_item tag '{
  "workId": {"S": "EK4UpOm4"},
  "tag": {"S": "other_後ろ姿"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"}
}'

# vX3DCagv のタグデータ
put_item tag '{
  "workId": {"S": "vX3DCagv"},
  "tag": {"S": "character_零崎蒼"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"}
}'

put_item tag '{
  "workId": {"S": "vX3DCagv"},
  "tag": {"S": "creator_tester"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"}
}'

put_item tag '{
  "workId": {"S": "vX3DCagv"},
  "tag": {"S": "format_"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"}
}'

put_item tag '{
  "workId": {"S": "vX3DCagv"},
  "tag": {"S": "genre_illustration"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"}
}'

put_item tag '{
  "workId": {"S": "vX3DCagv"},
  "tag": {"S": "other_GLOBAL"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"}
}'

put_item tag '{
  "workId": {"S": "vX3DCagv"},
  "tag": {"S": "other_夜"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"}
}'

echo "Tag table test data insertion completed."