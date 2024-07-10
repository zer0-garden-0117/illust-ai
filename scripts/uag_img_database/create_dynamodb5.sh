#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

# AWS CLI プロファイル
AWS_PROFILE=default

# カウンタの初期値
work_id=0
tag_id=0
img_id=0

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
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=name,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes "[
        {
            \"IndexName\": \"name-index\",
            \"KeySchema\": [{\"AttributeName\":\"name\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"},
            \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
        }
    ]" \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# work_tags テーブルの作成
aws dynamodb create-table \
    --table-name work_tags \
    --attribute-definitions AttributeName=work_id,AttributeType=S AttributeName=tag_id,AttributeType=S \
    --key-schema AttributeName=work_id,KeyType=HASH AttributeName=tag_id,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url $ENDPOINT_URL

# works テーブルにテストデータを追加
work_id=$(generate_id "work_id")
aws dynamodb put-item \
    --table-name works \
    --item "{\"id\": {\"S\": \"$work_id\"}, \"title\": {\"S\": \"Sample Work\"}, \"title_image_url\": {\"S\": \"http://example.com/title_image.jpg\"}, \"creator\": {\"S\": \"Sample Creator\"}, \"category\": {\"S\": \"Art\"}, \"subject\": {\"S\": \"Abstract\"}, \"language\": {\"S\": \"English\"}, \"created_at\": {\"S\": \"2024-07-08T00:00:00Z\"}, \"updated_at\": {\"S\": \"2024-07-08T00:00:00Z\"}, \"page_count\": {\"N\": \"100\"}, \"likes\": {\"N\": \"10\"}, \"downloads\": {\"N\": \"5\"}}" \
    --endpoint-url $ENDPOINT_URL

# images テーブルにテストデータを追加
img_id=$(generate_id "img_id")
aws dynamodb put-item \
    --table-name images \
    --item "{\"id\": {\"S\": \"$img_id\"}, \"work_id\": {\"S\": \"$work_id\"}, \"s3_url\": {\"S\": \"http://example.com/image1.jpg\"}}" \
    --endpoint-url $ENDPOINT_URL

img_id=$(generate_id "img_id")
aws dynamodb put-item \
    --table-name images \
    --item "{\"id\": {\"S\": \"$img_id\"}, \"work_id\": {\"S\": \"$work_id\"}, \"s3_url\": {\"S\": \"http://example.com/image2.jpg\"}}" \
    --endpoint-url $ENDPOINT_URL

# tags テーブルにテストデータを追加
tag_id=$(generate_id "tag_id")
aws dynamodb put-item \
    --table-name tags \
    --item "{\"id\": {\"S\": \"$tag_id\"}, \"name\": {\"S\": \"Sample Tag 1\"}}" \
    --endpoint-url $ENDPOINT_URL

tag_id=$(generate_id "tag_id")
aws dynamodb put-item \
    --table-name tags \
    --item "{\"id\": {\"S\": \"$tag_id\"}, \"name\": {\"S\": \"Sample Tag 2\"}}" \
    --endpoint-url $ENDPOINT_URL

# work_tags テーブルにテストデータを追加
aws dynamodb put-item \
    --table-name work_tags \
    --item "{\"work_id\": {\"S\": \"$work_id\"}, \"tag_id\": {\"S\": \"$tag_id\"}}" \
    --endpoint-url $ENDPOINT_URL

aws dynamodb put-item \
    --table-name work_tags \
    --item "{\"work_id\": {\"S\": \"$work_id\"}, \"tag_id\": {\"S\": \"$tag_id\"}}" \
    --endpoint-url $ENDPOINT_URL