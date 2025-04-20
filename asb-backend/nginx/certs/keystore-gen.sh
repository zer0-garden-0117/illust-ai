#!/bin/bash

# 認証局登録
mkcert -install

# pemファイル作成
mkcert localhost 127.0.0.1 ::1

# keystore作成
openssl pkcs12 -export \
    -in localhost+2.pem \
    -inkey localhost+2-key.pem \
    -out keystore.p12 \
    -name tomcat \
    -passout pass:uagpassword

# base64に変換
openssl base64 -in keystore.p12 -out keystore.p12.base64 -A