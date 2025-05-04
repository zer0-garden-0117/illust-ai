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

# workテーブルにテストデータを追加
echo "workテーブルにテストデータを追加します..."

put_item work '{
  "workId": {"S": "jahMEp6J"},
  "rate": {"N": "0"},
  "likes": {"N": "0"},
  "createdAt": {"S": "2025-05-03T15:18:21.537932307Z"},
  "subTitle": {"NULL": true},
  "titleImgUrl": {"S": "/testimage/titleImage_20250503_151821.avif"},
  "rateCount": {"N": "0"},
  "mainTitle": {"S": "test_image_2"},
  "watermaskImgUrl": {"S": "/testimage/watermaskImage_20250503_151821.avif"},
  "thumbnailImgUrl": {"S": "/testimage/thumbnailImage_20250503_151821.avif"},
  "rateSum": {"N": "0"},
  "updatedAt": {"S": "2025-05-03T15:18:21.537932307Z"},
  "description": {"NULL": true}
}'

put_item work '{
  "workId": {"S": "xERd9FNW"},
  "rate": {"N": "0"},
  "likes": {"N": "0"},
  "createdAt": {"S": "2025-05-03T15:17:12.143934005Z"},
  "subTitle": {"NULL": true},
  "titleImgUrl": {"S": "/testimage/titleImage_20250503_151712.avif"},
  "rateCount": {"N": "0"},
  "mainTitle": {"S": "test_image_1"},
  "watermaskImgUrl": {"S": "/testimage/watermaskImage_20250503_151712.avif"},
  "thumbnailImgUrl": {"S": "/testimage/thumbnailImage_20250503_151712.avif"},
  "rateSum": {"N": "0"},
  "updatedAt": {"S": "2025-05-03T15:17:12.143934005Z"},
  "description": {"NULL": true}
}'

put_item work '{
  "workId": {"S": "t_5XgsVa"},
  "rate": {"N": "0"},
  "likes": {"N": "0"},
  "createdAt": {"S": "2025-05-03T16:00:40.646656452Z"},
  "subTitle": {"NULL": true},
  "titleImgUrl": {"S": "/testimage/titleImage_20250503_160040.avif"},
  "rateCount": {"N": "0"},
  "mainTitle": {"S": "test_icon_1"},
  "watermaskImgUrl": {"S": "/testimage/watermaskImage_20250503_160040.avif"},
  "thumbnailImgUrl": {"S": "/testimage/thumbnailImage_20250503_160040.avif"},
  "rateSum": {"N": "0"},
  "updatedAt": {"S": "2025-05-03T16:00:40.646656452Z"},
  "description": {"NULL": true}
}'

put_item work '{
  "workId": {"S": "EK4UpOm4"},
  "rate": {"N": "0"},
  "likes": {"N": "0"},
  "createdAt": {"S": "2025-05-03T15:59:48.530122627Z"},
  "subTitle": {"NULL": true},
  "titleImgUrl": {"S": "/testimage/titleImage_20250503_155948.avif"},
  "rateCount": {"N": "0"},
  "mainTitle": {"S": "test_image_4"},
  "watermaskImgUrl": {"S": "/testimage/watermaskImage_20250503_155948.avif"},
  "thumbnailImgUrl": {"S": "/testimage/thumbnailImage_20250503_155948.avif"},
  "rateSum": {"N": "0"},
  "updatedAt": {"S": "2025-05-03T15:59:48.530122627Z"},
  "description": {"NULL": true}
}'

put_item work '{
  "workId": {"S": "vX3DCagv"},
  "rate": {"N": "0"},
  "likes": {"N": "0"},
  "createdAt": {"S": "2025-05-03T15:59:01.225319455Z"},
  "subTitle": {"NULL": true},
  "titleImgUrl": {"S": "/testimage/titleImage_20250503_155901.avif"},
  "rateCount": {"N": "0"},
  "mainTitle": {"S": "test_image_3"},
  "watermaskImgUrl": {"S": "/testimage/watermaskImage_20250503_155901.avif"},
  "thumbnailImgUrl": {"S": "/testimage/thumbnailImage_20250503_155901.avif"},
  "rateSum": {"N": "0"},
  "updatedAt": {"S": "2025-05-03T15:59:01.225319455Z"},
  "description": {"NULL": true}
}'

echo "テストデータの追加が完了しました。"