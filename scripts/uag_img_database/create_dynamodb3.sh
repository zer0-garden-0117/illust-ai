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

# worksテーブルに対して最初のインデックスを追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=category,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"category-index\",
                \"KeySchema\": [{\"AttributeName\":\"category\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# subject-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=subject,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"subject-index\",
                \"KeySchema\": [{\"AttributeName\":\"subject\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# language-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=language,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"language-index\",
                \"KeySchema\": [{\"AttributeName\":\"language\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# created_at-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=created_at,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"created_at-index\",
                \"KeySchema\": [{\"AttributeName\":\"created_at\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# updated_at-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=updated_at,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"updated_at-index\",
                \"KeySchema\": [{\"AttributeName\":\"updated_at\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

    # likes-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=likes,AttributeType=N \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"likes-index\",
                \"KeySchema\": [{\"AttributeName\":\"likes\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# downloads-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=downloads,AttributeType=N \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"downloads-index\",
                \"KeySchema\": [{\"AttributeName\":\"downloads\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# title-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=title,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"title-index\",
                \"KeySchema\": [{\"AttributeName\":\"title\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# creator-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=creator,AttributeType=S \
    --global-secondary-index-updates "[
        {
            \"Create\": {
                \"IndexName\": \"creator-index\",
                \"KeySchema\": [{\"AttributeName\":\"creator\",\"KeyType\":\"HASH\"}],
                \"Projection\": {\"ProjectionType\":\"ALL\"},
                \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5}
            }
        }
    ]" \
    --endpoint-url http://localhost:10000

# title_image_url-indexの追加
aws dynamodb update-table \
    --table-name works \
    --attribute-definitions AttributeName=title_image_url,AttributeType=S \
    --global-secondary-index-updates "[
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

# テストデータの追加

# works テーブルにテストデータを追加
aws dynamodb put-item \
    --table-name works \
    --item '{
        "id": {"S": "work-123"},
        "title": {"S": "Sample Work"},
        "title_image_url": {"S": "http://example.com/title_image.jpg"},
        "creator": {"S": "Sample Creator"},
        "category": {"S": "Art"},
        "subject": {"S": "Abstract"},
        "language": {"S": "English"},
        "created_at": {"S": "2024-07-08T00:00:00Z"},
        "updated_at": {"S": "2024-07-08T00:00:00Z"},
        "page_count": {"N": "100"},
        "likes": {"N": "10"},
        "downloads": {"N": "5"}
    }' \
    --endpoint-url http://localhost:10000

# images テーブルにテストデータを追加
aws dynamodb put-item \
    --table-name images \
    --item '{
        "id": {"S": "image-123"},
        "work_id": {"S": "work-123"},
        "s3_url": {"S": "http://example.com/image1.jpg"}
    }' \
    --endpoint-url http://localhost:10000

aws dynamodb put-item \
    --table-name images \
    --item '{
        "id": {"S": "image-124"},
        "work_id": {"S": "work-123"},
        "s3_url": {"S": "http://example.com/image2.jpg"}
    }' \
    --endpoint-url http://localhost:10000

# tags テーブルにテストデータを追加
aws dynamodb put-item \
    --table-name tags \
    --item '{
        "id": {"S": "tag-123"},
        "name": {"S": "Sample Tag 1"}
    }' \
    --endpoint-url http://localhost:10000

aws dynamodb put-item \
    --table-name tags \
    --item '{
        "id": {"S": "tag-124"},
        "name": {"S": "Sample Tag 2"}
    }' \
    --endpoint-url http://localhost:10000

# work_tags テーブルにテストデータを追加
aws dynamodb put-item \
    --table-name work_tags \
    --item '{
        "work_id": {"S": "work-123"},
        "tag_id": {"S": "tag-123"}
    }' \
    --endpoint-url http://localhost:10000

aws dynamodb put-item \
    --table-name work_tags \
    --item '{
        "work_id": {"S": "work-123"},
        "tag_id": {"S": "tag-124"}
    }' \
    --endpoint-url http://localhost:10000