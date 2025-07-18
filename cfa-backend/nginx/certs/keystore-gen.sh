#!/bin/bash
set -euo pipefail

# config.ini から設定を読み取る
CONFIG_FILE="config.ini"

# PJNAME を取得
PJNAME=$(awk -F'=' '/^\[General\]/ { getline; while ($0 !~ /^\[/) { if ($1 ~ /^PJNAME/) { print $2; exit } getline } }' "$CONFIG_FILE" | tr -d ' ')

# PASSWORD を取得
PASSWORD=$(awk -F'=' '/^\[General\]/ { getline; while ($0 !~ /^\[/) { if ($1 ~ /^PASSWORD/) { print $2; exit } getline } }' "$CONFIG_FILE" | tr -d ' ')

# 必須パラメータチェック
if [ -z "$PJNAME" ]; then
    echo "Error: PJNAME not found in $CONFIG_FILE"
    exit 1
fi

if [ -z "$PASSWORD" ]; then
    echo "Error: PASSWORD not found in $CONFIG_FILE"
    exit 1
fi

# 生成するファイル名
cert_file="${PJNAME}.pem"
key_file="${PJNAME}-key.pem"
keystore_file="${PJNAME}-keystore.p12"

# 認証局登録
mkcert -install

# PEM ファイル作成
mkcert -cert-file "$cert_file" -key-file "$key_file" localhost 127.0.0.1 ::1

# Keystore 作成
openssl pkcs12 -export \
    -in "$cert_file" \
    -inkey "$key_file" \
    -out "$keystore_file" \
    -name tomcat \
    -passout pass:"$PASSWORD"

echo "Keystore generated: $keystore_file"