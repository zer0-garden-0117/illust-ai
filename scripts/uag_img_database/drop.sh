#!/bin/bash

# config.sh を読み込む
source ./config.sh

# DynamoDBのテーブル名を取得
tables=$(aws dynamodb list-tables --endpoint-url "$ENDPOINT_URL" --query "TableNames" --output text)

# 各テーブルを削除
if [ -z "$tables" ]; then
    echo "削除するテーブルがありません。"
else
    for table in $tables
    do
        echo "Deleting table: $table"
        aws dynamodb delete-table --table-name "$table" --endpoint-url "$ENDPOINT_URL" --no-cli-pager
    done
    echo "すべてのテーブルが削除されました。"
fi