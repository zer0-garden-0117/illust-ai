#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

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
    --attribute-definitions AttributeName=workId,AttributeType=S \
    --key-schema AttributeName=workId,KeyType=HASH

# workByPage テーブルの作成
create_table workByPage \
    --attribute-definitions AttributeName=workId,AttributeType=S AttributeName=pageNum,AttributeType=N \
    --key-schema AttributeName=workId,KeyType=HASH AttributeName=pageNum,KeyType=RANGE

# workByTag テーブルの作成
create_table workByTag \
    --attribute-definitions AttributeName=workId,AttributeType=S AttributeName=tagName,AttributeType=S \
    --key-schema AttributeName=workId,KeyType=HASH AttributeName=tagName,KeyType=RANGE

# tagByWork テーブルの作成
create_table tagByWork \
    --attribute-definitions AttributeName=tagName,AttributeType=S AttributeName=workId,AttributeType=S \
    --key-schema AttributeName=tagName,KeyType=HASH AttributeName=workId,KeyType=RANGE

# tagByCategory テーブルの作成
create_table tagByCategory \
    --attribute-definitions AttributeName=tagName,AttributeType=S AttributeName=categoryName,AttributeType=S \
    --key-schema AttributeName=tagName,KeyType=HASH AttributeName=categoryName,KeyType=RANGE

# categoryByTag テーブルの作成
create_table categoryByTag \
    --attribute-definitions AttributeName=categoryName,AttributeType=S AttributeName=tagName,AttributeType=S \
    --key-schema AttributeName=categoryName,KeyType=HASH AttributeName=tagName,KeyType=RANGE

# user テーブルの作成
create_table user \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH

# userByLikedWork テーブルの作成
create_table userByLikedWork \
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=likedWorkId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH AttributeName=likedWorkId,KeyType=RANGE

# userByViewedWork テーブルの作成
create_table userByViewedWork \
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=viewedWorkId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH AttributeName=viewedWorkId,KeyType=RANGE

echo "All tables created successfully."

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
    aws dynamodb put-item \
        --table-name work \
        --item "{\"workId\": {\"S\": \"$work_id\"}, \"mainTitle\": {\"S\": \"Sample Work $i\"}, \"subTitle\": {\"S\": \"Sample Subtitle $i\"}, \"description\": {\"S\": \"Sample Description $i\"}, \"pages\": {\"S\": \"30\"}, \"workSize\": {\"S\": \"30MB\"}, \"likes\": {\"N\": \"0\"}, \"downloads\": {\"N\": \"0\"}, \"titleImageUrl\": {\"S\": \"http://example.com/title_image_$i.jpg\"}, \"createdAt\": {\"S\": \"2024-07-08T00:00:00Z\"}, \"updatedAt\": {\"S\": \"2024-07-08T00:00:00Z\"}}" \
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

# categoryByTag
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "workFormat"}, "tagName": {"S": "CG"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "workFormat"}, "tagName": {"S": "コミック"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "topicGenre"}, "tagName": {"S": "オリジナル"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "topicGenre"}, "tagName": {"S": "二次創作"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "characterName"}, "tagName": {"S": "真白"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "creator"}, "tagName": {"S": "Sample Creator 1"}}' --endpoint-url $ENDPOINT_URL
aws dynamodb put-item --table-name categoryByTag --item '{"categoryName": {"S": "language"}, "tagName": {"S": "English"}}' --endpoint-url $ENDPOINT_URL

# tagByCategory
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
    user_id=$(generate_id "userId")
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