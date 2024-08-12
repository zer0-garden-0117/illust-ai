#!/bin/bash

# DynamoDB Localのエンドポイント
ENDPOINT_URL=http://localhost:10000

aws dynamodb query \
    --table-name tag \
    --index-name TagIndex \
    --key-condition-expression "tag = :tagValue" \
    --expression-attribute-values '{":tagValue":{"S":"Tag_1"}}' \
    --projection-expression "workId, tag" \
    --endpoint-url $ENDPOINT_URL