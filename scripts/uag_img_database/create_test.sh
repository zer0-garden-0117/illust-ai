#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

# 初期カウンターの設定
aws dynamodb put-item \
    --table-name counters \
    --item '{"counterName": {"S": "workId"}, "counterValue": {"N": "0"}}' \
    --endpoint-url $ENDPOINT_URL

# IDを生成する関数
generate_id() {
    local counter_name=$1
    local current_value=$(aws dynamodb update-item \
        --table-name counters \
        --key "{\"counterName\": {\"S\": \"$counter_name\"}}" \
        --update-expression "SET counterValue = if_not_exists(counterValue, :start) + :inc" \
        --expression-attribute-values '{":inc": {"N": "1"}, ":start": {"N": "0"}}' \
        --return-values "UPDATED_NEW" \
        --endpoint-url $ENDPOINT_URL \
        --query "Attributes.counterValue.N" \
        --output text)
    echo $current_value
}

# work テーブルにテストデータを追加
work_ids=()
for i in {1..3}
do
    work_id=$(generate_id "workId")
    work_ids+=($work_id)
    genre="Genre_$i"
    format="Format_$i"
    main_title="${work_id}_Sample Work $i"
    subtitle="${work_id}_Sample Subtitle $i"
    description="${work_id}_Sample Description $i"
    work_size=$((i * 100))
    pages=$((i * 10))
    title_img_url="https://example.com/image_$i.png"
    likes=$((i * 10))
    downloads=$((i * 5))

    aws dynamodb put-item \
        --table-name work \
        --item "{\"workId\": {\"N\": \"$work_id\"}, \"workSize\": {\"N\": \"$work_size\"}, \"pages\": {\"N\": \"$pages\"}, \"titleImgUrl\": {\"S\": \"$title_img_url\"}, \"likes\": {\"N\": \"$likes\"}, \"downloads\": {\"N\": \"$downloads\"}, \"createdAt\": {\"S\": \"2024-08-13T00:00:00Z\"}, \"updatedAt\": {\"S\": \"2024-08-13T00:00:00Z\"}, \"mainTitle\": {\"S\": \"$main_title\"}, \"subTitle\": {\"S\": \"$subtitle\"}, \"description\": {\"S\": \"$description\"}, \"genre\": {\"S\": \"$genre\"}, \"format\": {\"S\": \"$format\"}}" \
        --endpoint-url $ENDPOINT_URL
done

echo "work テーブルにテストデータが追加されました。"

# テストデータの追加関数
add_test_data() {
    local table_name=$1
    local work_id=$2
    local attribute_name=$3
    local attribute_value=$4

    aws dynamodb put-item \
        --table-name $table_name \
        --item "{\"workId\": {\"N\": \"$work_id\"}, \"$attribute_name\": {\"S\": \"$attribute_value\"}}" \
        --endpoint-url $ENDPOINT_URL
}

# テストデータの追加関数
add_test_data2() {
    local table_name=$1
    local work_id=$2
    local attribute_name=$3
    local attribute_value=$4
    local img_page_num=$5

    aws dynamodb put-item \
        --table-name $table_name \
        --item "{\"workId\": {\"N\": \"$work_id\"}, \"$attribute_name\": {\"S\": \"$attribute_value\"}, \"imgPageNum\": {\"N\": \"$img_page_num\"}}" \
        --endpoint-url $ENDPOINT_URL
}

# tag テーブルにテストデータを追加
add_test_data "tag" "${work_ids[0]}" "tag" "Tag_1"
add_test_data "tag" "${work_ids[0]}" "tag" "Tag_2"
add_test_data "tag" "${work_ids[1]}" "tag" "Tag_2"
add_test_data "tag" "${work_ids[1]}" "tag" "Tag_3"
add_test_data "tag" "${work_ids[2]}" "tag" "Tag_3"
add_test_data "tag" "${work_ids[2]}" "tag" "Tag_1"

# character テーブルにテストデータを追加
add_test_data "character" "${work_ids[0]}" "character" "Character_1_1"
add_test_data "character" "${work_ids[0]}" "character" "Character_1_2"
add_test_data "character" "${work_ids[1]}" "character" "Character_2_1"
add_test_data "character" "${work_ids[1]}" "character" "Character_2_2"
add_test_data "character" "${work_ids[2]}" "character" "Character_3_1"
add_test_data "character" "${work_ids[2]}" "character" "Character_3_2"

# creator テーブルにテストデータを追加
add_test_data "creator" "${work_ids[0]}" "creator" "Creator_1_1"
add_test_data "creator" "${work_ids[0]}" "creator" "Creator_1_2"
add_test_data "creator" "${work_ids[1]}" "creator" "Creator_2_1"
add_test_data "creator" "${work_ids[1]}" "creator" "Creator_2_2"
add_test_data "creator" "${work_ids[2]}" "creator" "Creator_3_1"
add_test_data "creator" "${work_ids[2]}" "creator" "Creator_3_2"

# img テーブルにテストデータを追加
add_test_data2 "img" "${work_ids[0]}" "imgUrl" "https://example.com/work1_image1.avif" "1"
add_test_data2 "img" "${work_ids[0]}" "imgUrl" "https://example.com/work1_image2.avif" "2"
add_test_data2 "img" "${work_ids[1]}" "imgUrl" "https://example.com/work2_image1.avif" "1"
add_test_data2 "img" "${work_ids[1]}" "imgUrl" "https://example.com/work2_image2.avif" "2"
add_test_data2 "img" "${work_ids[2]}" "imgUrl" "https://example.com/work3_image1.avif" "1"
add_test_data2 "img" "${work_ids[2]}" "imgUrl" "https://example.com/work3_image2.avif" "2"

# user テーブルにテストデータを追加
user_roles=("admin" "editor" "viewer")
for i in "${!user_roles[@]}"
do
    if [ "$i" -eq 0 ]; then
        user_id="t.t.m.roien@gmail.com"  # 特定のメールアドレスに修正
    else
        user_id="user${i}@example.com"
    fi
    user_role=${user_roles[$i]}

    # テーブルにデータを追加
    aws dynamodb put-item \
    --table-name user \
    --item "{\"userId\": {\"S\": \"$user_id\"}, \"userRole\": {\"S\": \"$user_role\"}}" \
    --endpoint-url $ENDPOINT_URL

    # liked テーブルにテストデータを追加
    for work_id in "${!work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name liked \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"workId\": {\"N\": \"${work_ids[$work_id]}\"}}" \
            --endpoint-url $ENDPOINT_URL
    done

    # viewed テーブルにテストデータを追加
    for work_id in "${!work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name viewed \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"workId\": {\"N\": \"${work_ids[$work_id]}\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

echo "tag, character, creator テーブルにテストデータが追加されました。"