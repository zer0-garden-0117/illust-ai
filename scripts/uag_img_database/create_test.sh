#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

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
    main_title="${work_id}_Sample Work $i"
    sub_title="${work_id}_Sample Subtitle $i"
    description="${work_id}_Sample Description $i"

    aws dynamodb put-item \
        --table-name work \
        --item "{\"workId\": {\"S\": \"$work_id\"}, \"mainTitle\": {\"S\": \"$main_title\"}, \"subTitle\": {\"S\": \"$sub_title\"}, \"description\": {\"S\": \"$description\"}, \"pages\": {\"S\": \"30\"}, \"workSize\": {\"S\": \"30MB\"}, \"likes\": {\"N\": \"0\"}, \"downloads\": {\"N\": \"0\"}, \"titleImageUrl\": {\"S\": \"http://example.com/title_image_$i.jpg\"}, \"createdAt\": {\"S\": \"2024-07-08T00:00:00Z\"}, \"updatedAt\": {\"S\": \"2024-07-08T00:00:00Z\"}}" \
        --endpoint-url $ENDPOINT_URL

    # mainTitleByWork テーブルにテストデータを追加
    aws dynamodb put-item \
        --table-name mainTitleByWork \
        --item "{\"mainTitle\": {\"S\": \"$main_title\"}, \"workId\": {\"S\": \"$work_id\"}}" \
        --endpoint-url $ENDPOINT_URL

    # subTitleByWork テーブルにテストデータを追加
    aws dynamodb put-item \
        --table-name subTitleByWork \
        --item "{\"subTitle\": {\"S\": \"$sub_title\"}, \"workId\": {\"S\": \"$work_id\"}}" \
        --endpoint-url $ENDPOINT_URL

    # descriptionByWork テーブルにテストデータを追加
    aws dynamodb put-item \
        --table-name descriptionByWork \
        --item "{\"description\": {\"S\": \"$description\"}, \"workId\": {\"S\": \"$work_id\"}}" \
        --endpoint-url $ENDPOINT_URL

    # workByPage テーブルにテストデータを追加
    for j in {1..2}
    do
        aws dynamodb put-item \
            --table-name workByPage \
            --item "{\"workId\": {\"S\": \"$work_id\"}, \"s3Url\": {\"S\": \"http://example.com/image${i}_${j}.jpg\"}, \"pageNum\": {\"N\": \"$j\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

# categoryByTag テーブルにテストデータを追加
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "workFormat"}, "tagName": {"S": "CG"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "workFormat"}, "tagName": {"S": "コミック"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "topicGenre"}, "tagName": {"S": "オリジナル"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "topicGenre"}, "tagName": {"S": "二次創作"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "characterName"}, "tagName": {"S": "真白"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "creator"}, "tagName": {"S": "Sample Creator 1"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "language"}, "tagName": {"S": "English"}}' --endpoint-url $ENDPOINT_URL

# tagByCategory テーブルにテストデータを追加
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "CG"}, "categoryName": {"S": "workFormat"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "コミック"}, "categoryName": {"S": "workFormat"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "オリジナル"}, "categoryName": {"S": "topicGenre"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "二次創作"}, "categoryName": {"S": "topicGenre"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "真白"}, "categoryName": {"S": "characterName"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "Sample Creator 1"}, "categoryName": {"S": "creator"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name tagByCategory --item '{"tagName": {"S": "English"}, "categoryName": {"S": "language"}}' --endpoint-url $ENDPOINT_URL

# workByTag テーブルと tagByWork テーブルにテストデータを追加
for work_id in "${work_ids[@]}"
do
    for tag in "CG" "オリジナル" "真白"
    do
        aws dynamodb put-item \
            --table-name workByTag \
            --item "{\"workId\": {\"S\": \"$work_id\"}, \"tagName\": {\"S\": \"$tag\"}}" \
            --endpoint-url $ENDPOINT_URL

        aws dynamodb put-item \
            --table-name tagByWork \
            --item "{\"tagName\": {\"S\": \"$tag\"}, \"workId\": {\"S\": \"$work_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

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
    aws dynamodb put-item \
        --table-name user \
        --item "{\"userId\": {\"S\": \"$user_id\"}, \"userRole\": {\"S\": \"$user_role\"}}" \
        --endpoint-url $ENDPOINT_URL

    # userByLikedWork テーブルにテストデータを追加
    for work_id in "${work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name userByLikedWork \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"likedWorkId\": {\"S\": \"$work_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done

    # userByViewedWork テーブルにテストデータを追加
    for work_id in "${work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name userByViewedWork \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"viewedWorkId\": {\"S\": \"$work_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

echo "Test data inserted successfully."