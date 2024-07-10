#!/bin/bash

# テーブル名のリスト
tables=("works" "images" "tags" "work_tags" "counters")

# 各テーブルを削除
for table in "${tables[@]}"
do
    aws dynamodb delete-table \
        --table-name "$table" \
        --endpoint-url http://localhost:10000 \
        --no-cli-pager
done