#!/bin/bash

# works テーブルの作成
aws dynamodb create-table \
    --table-name works \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:10000

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
    --endpoint-url http://localhost:10000

# tags テーブルの作成
aws dynamodb create-table \
    --table-name tags \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:10000

# work_tags テーブルの作成
aws dynamodb create-table \
    --table-name work_tags \
    --attribute-definitions AttributeName=work_id,AttributeType=S AttributeName=tag_id,AttributeType=S \
    --key-schema AttributeName=work_id,KeyType=HASH AttributeName=tag_id,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:10000
