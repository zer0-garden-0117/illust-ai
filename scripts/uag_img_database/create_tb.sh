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

# mainTitleByWork テーブルの作成
create_table mainTitleByWork \
    --attribute-definitions AttributeName=mainTitle,AttributeType=S \
    --key-schema AttributeName=mainTitle,KeyType=HASH

# subTitleByWork テーブルの作成
create_table subTitleByWork \
    --attribute-definitions AttributeName=subTitle,AttributeType=S \
    --key-schema AttributeName=subTitle,KeyType=HASH

# descriptionByWork テーブルの作成
create_table descriptionByWork \
    --attribute-definitions AttributeName=description,AttributeType=S \
    --key-schema AttributeName=description,KeyType=HASH

echo "All tables created successfully."