#!/bin/bash

# 設定ファイルのパス
SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
CONFIG_FILE="${SCRIPT_DIR}/config.ini"

# 設定ファイルの存在確認
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Config file not found: $CONFIG_FILE"
    exit 1
fi

# `config.ini` から設定を読み取る関数
get_config_value() {
    local section=$1
    local key=$2
    awk -F '=' '/\['"$section"'\]/ {section=1} section==1 && $1~/'"$key"'/{gsub(/[ \t]+/, "", $2); print $2; exit}' "$CONFIG_FILE"
}

# `config.ini` から設定を取得
ENVIRONMENT=$(get_config_value "General" "ENVIRONMENT")
PROFILE=$(get_config_value "General" "PROFILE")
PROD_ENDPOINT_URL=$(get_config_value "Endpoints" "PROD_ENDPOINT_URL")
DEV_ENDPOINT_URL=$(get_config_value "Endpoints" "DEV_ENDPOINT_URL")
TEST_ENDPOINT_URL=$(get_config_value "Endpoints" "TEST_ENDPOINT_URL")

# 必須変数の確認
if [ -z "$ENVIRONMENT" ] || [ -z "$PROFILE" ] || [ -z "$PROD_ENDPOINT_URL" ] || [ -z "$DEV_ENDPOINT_URL" ] || [ -z "$TEST_ENDPOINT_URL" ]; then
    echo "Please define ENVIRONMENT, PROFILE, PROD_ENDPOINT_URL, DEV_ENDPOINT_URL, and TEST_ENDPOINT_URL in the config file."
    exit 1
fi

# 環境に応じてENDPOINT_URLを設定
if [ "$ENVIRONMENT" == "prod" ]; then
    ENDPOINT_URL="$PROD_ENDPOINT_URL"
elif [ "$ENVIRONMENT" == "dev" ]; then
    ENDPOINT_URL="$DEV_ENDPOINT_URL"
elif [ "$ENVIRONMENT" == "test" ]; then
    ENDPOINT_URL="$TEST_ENDPOINT_URL"
else
    cho "Invalid ENVIRONMENT. Please set to either 'prod', 'dev', or 'test'."
    exit 1
fi