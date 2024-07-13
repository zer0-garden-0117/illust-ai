#!/bin/bash

# テーブル名のリスト
tables=("works" "images" "tags" "work_tags" "counters" "users" "user_likes" "user_downloads" "user_views")

# 各テーブルを削除
for table in "${tables[@]}"
do
    echo "Deleting table: $table"
    command="aws dynamodb delete-table --table-name $table --endpoint-url http://localhost:10000 --no-cli-pager"
    echo "Running command: $command"
    $command
done