#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

# AWS CLI プロファイル
AWS_PROFILE=default

# counters テーブルの作成
aws dynamodb create-table \
    --table-name counters \
    --attribute-definitions AttributeName=counter_name,AttributeType=S \
    --key-schema AttributeName=counter_name,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# works テーブルの作成
aws dynamodb create-table \
    --table-name works \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# images テーブルの作成
aws dynamodb create-table \
    --table-name images \
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=work_id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes "[
        {
            \"IndexName\": \"work_id-index\",
            \"KeySchema\": [{\"AttributeName\":\"work_id\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"},
            \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
        }
    ]" \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# tags テーブルの作成
aws dynamodb create-table \
    --table-name tags \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# work_tags テーブルの作成
aws dynamodb create-table \
    --table-name work_tags \
    --attribute-definitions AttributeName=work_id,AttributeType=S AttributeName=tag_id,AttributeType=S \
    --key-schema AttributeName=work_id,KeyType=HASH AttributeName=tag_id,KeyType=RANGE \
    --global-secondary-indexes "[
        {
            \"IndexName\": \"tag_id-index\",
            \"KeySchema\": [{\"AttributeName\":\"tag_id\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"},
            \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
        }
    ]" \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# users テーブルの作成
aws dynamodb create-table \
    --table-name users \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# user_likes テーブルの作成
aws dynamodb create-table \
    --table-name user_likes \
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=workId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH AttributeName=workId,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# user_downloads テーブルの作成
aws dynamodb create-table \
    --table-name user_downloads \
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=workId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH AttributeName=workId,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# user_views テーブルの作成
aws dynamodb create-table \
    --table-name user_views \
    --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=workId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH AttributeName=workId,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# IDを生成する関数
generate_id() {
    local counter_name=$1
    local current_value=$(aws dynamodb update-item \
        --table-name counters \
        --key "{\"counter_name\": {\"S\": \"$counter_name\"}}" \
        --update-expression "SET counter_value = if_not_exists(counter_value, :start) + :inc" \
        --expression-attribute-values '{":inc": {"N": "1"}, ":start": {"N": "0"}}' \
        --return-values "UPDATED_NEW" \
        --endpoint-url $ENDPOINT_URL \
        --query "Attributes.counter_value.N" \
        --output text)
    echo $current_value
}

# works テーブルにテストデータを追加
work_ids=()
for i in {1..3}
do
    work_id=$(generate_id "work_id")
    work_ids+=($work_id)
    aws dynamodb put-item \
        --table-name works \
        --item "{\"id\": {\"S\": \"$work_id\"}, \"mainTitle\": {\"S\": \"Sample Work $i\"}, \"subTitle\": {\"S\": \"Sample Subtitle $i\"}, \"description\": {\"S\": \"Sample Description $i\"}, \"workFormat\": {\"S\": \"CG/コミック/ゲーム\"}, \"topicGenre\": {\"S\": \"オリジナル/二次創作/パロディ\"}, \"creator\": {\"S\": \"Sample Creator $i\"}, \"pages\": {\"S\": \"30\"}, \"size\": {\"S\": \"30MB\"}, \"language\": {\"S\": \"English\"}, \"likes\": {\"N\": \"0\"}, \"downloads\": {\"N\": \"0\"}, \"titleImageUrl\": {\"S\": \"http://example.com/title_image_$i.jpg\"}, \"createdAt\": {\"S\": \"2024-07-08T00:00:00Z\"}, \"updatedAt\": {\"S\": \"2024-07-08T00:00:00Z\"}}" \
        --endpoint-url $ENDPOINT_URL

    # images テーブルにテストデータを追加
    for j in {1..2}
    do
        img_id=$(generate_id "img_id")
        aws dynamodb put-item \
            --table-name images \
            --item "{\"id\": {\"S\": \"$img_id\"}, \"work_id\": {\"S\": \"$work_id\"}, \"s3_url\": {\"S\": \"http://example.com/image${i}_${j}.jpg\"}, \"pageNumber\": {\"N\": \"$j\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

# tags テーブルにテストデータを追加
tag_ids=()
for i in {1..5}
do
    tag_id=$(generate_id "tag_id")
    tag_ids+=($tag_id)
    aws dynamodb put-item \
        --table-name tags \
        --item "{\"id\": {\"S\": \"$tag_id\"}, \"name\": {\"S\": \"Sample Tag $i\"}}" \
        --endpoint-url $ENDPOINT_URL
done

# work_tags テーブルにテストデータを追加
for work_id in "${work_ids[@]}"
do
    for tag_id in "${tag_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name work_tags \
            --item "{\"work_id\": {\"S\": \"$work_id\"}, \"tag_id\": {\"S\": \"$tag_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

# users テーブルにテストデータを追加
user_ids=()
user_roles=("admin" "editor" "viewer")
for i in "${!user_roles[@]}"
do
    user_id=$(generate_id "user_id")
    user_ids+=($user_id)
    user_role=${user_roles[$i]}
    aws dynamodb put-item \
        --table-name users \
        --item "{\"userId\": {\"S\": \"$user_id\"}, \"userRole\": {\"S\": \"$user_role\"}}" \
        --endpoint-url $ENDPOINT_URL
done

# user_likes テーブルにテストデータを追加
for user_id in "${user_ids[@]}"
do
    for work_id in "${work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name user_likes \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"workId\": {\"S\": \"$work_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

# user_downloads テーブルにテストデータを追加
for user_id in "${user_ids[@]}"
do
    for work_id in "${work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name user_downloads \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"workId\": {\"S\": \"$work_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done

# user_views テーブルにテストデータを追加
for user_id in "${user_ids[@]}"
do
    for work_id in "${work_ids[@]}"
    do
        aws dynamodb put-item \
            --table-name user_views \
            --item "{\"userId\": {\"S\": \"$user_id\"}, \"workId\": {\"S\": \"$work_id\"}}" \
            --endpoint-url $ENDPOINT_URL
    done
done