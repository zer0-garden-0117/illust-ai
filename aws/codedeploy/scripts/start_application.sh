#!/bin/bash

# メッセージを出力
echo "Starting application..."

# /opt/zer0/ ディレクトリが存在し、書き込み権限があるかを確認
if [ ! -d "/opt/zer0" ]; then
  echo "/opt/zer0 does not exist. Creating directory."
  sudo mkdir -p /opt/zer0
  sudo chmod 755 /opt/zer0
fi

# ログファイルが存在しなければ作成し、権限を確認
if [ ! -f "/opt/zer0/app.log" ]; then
  echo "Log file does not exist. Creating /opt/zer0/app.log."
  sudo touch /opt/zer0/app.log
  sudo chmod 666 /opt/zer0/app.log  # 書き込み権限を全ユーザーに付与
fi

# Java アプリケーションをバックグラウンドで実行し、ログを app.log に出力
nohup java -jar /opt/zer0/zer0-0.0.1-SNAPSHOT.war --spring.profiles.active=prod >> /opt/zer0/app.log 2>&1 &

# 実行結果を確認
if [ $? -eq 0 ]; then
  echo "Application started successfully."
else
  echo "Failed to start application."
fi