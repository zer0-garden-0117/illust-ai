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
    --endpoint-url http://localhost:10000

# work_tags テーブルの作成
aws dynamodb create-table \
    --table-name work_tags \
    --attribute-definitions AttributeName=work_id,AttributeType=S AttributeName=tag_id,AttributeType=S \
    --key-schema AttributeName=work_id,KeyType=HASH AttributeName=tag_id,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:10000

# GSIの追加（DynamoDBはテーブル作成時にインデックスをまとめて設定するため）
# worksテーブルに対して、カテゴリ、サブジェクト、言語、作成日時、更新日時、ライク、ダウンロード、タイトル、作成者、タイトル画像URLでのGSIを追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=category,AttributeType=S AttributeName=subject,AttributeType=S AttributeName=language,AttributeType=S AttributeName=created_at,AttributeType=S AttributeName=updated_at,AttributeType=S AttributeName=likes,AttributeType=N AttributeName=downloads,AttributeType=N AttributeName=title,AttributeType=S AttributeName=creator,AttributeType=S AttributeName=title_image_url,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"category-index\",
                \"KeySchema\": [{\"AttributeName\":\"category\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"subject-index\",
                \"KeySchema\": [{\"AttributeName\":\"subject\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"language-index\",
                \"KeySchema\": [{\"AttributeName\":\"language\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"created_at-index\",
                \"KeySchema\": [{\"AttributeName\":\"created_at\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"updated_at-index\",
                \"KeySchema\": [{\"AttributeName\":\"updated_at\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"likes-index\",
                \"KeySchema\": [{\"AttributeName\":\"likes\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"downloads-index\",
                \"KeySchema\": [{\"AttributeName\":\"downloads\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"title-index\",
                \"KeySchema\": [{\"AttributeName\":\"title\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"creator-index\",
                \"KeySchema\": [{\"AttributeName\":\"creator\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        },
        {
            \"Create\": {
                \"IndexName\": \"title_image_url-index\",
                \"KeySchema\": [{\"AttributeName\":\"title_image_url\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000