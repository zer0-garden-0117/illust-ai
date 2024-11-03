#!/bin/bash

# DynamoDB Localのエンドポイント
# ENDPOINT_URL=http://localhost:10000
ENDPOINT_URL=https://dynamodb.us-east-1.amazonaws.com

# テーブル名の一覧を取得
tables=$(aws dynamodb list-tables --endpoint-url $ENDPOINT_URL --query "TableNames" --output text)

# 各テーブルを削除
for table in $tables
do
    echo "Deleting table: $table"
    aws dynamodb delete-table --table-name $table --endpoint-url $ENDPOINT_URL --no-cli-pager
done