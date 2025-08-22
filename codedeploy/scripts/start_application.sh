#!/bin/bash

# メッセージを出力
echo "Starting application..."

# /opt/zer0/ ディレクトリが存在し、書き込み権限があるかを確認
if [ ! -d "/opt/zer0" ]; then
  echo "/opt/zer0 does not exist. Creating directory."
  sudo mkdir -p /opt/zer0
  sudo chmod 755 /opt/zer0
fi

# /opt/zer0/logs/ ディレクトリが存在し、書き込み権限があるかを確認
if [ ! -d "/opt/zer0/logs" ]; then
  echo "/opt/zer0/logs does not exist. Creating directory."
  sudo mkdir -p /opt/zer0/logs
  sudo chmod 755 /opt/zer0/logs
fi

# 現在の日時を取得し、ログファイル名に使用
LOG_FILE="/opt/zer0/logs/$(date +'%Y-%m-%d_%H-%M-%S').log"

# ログファイルを作成し、書き込み権限を設定
sudo touch "$LOG_FILE"
sudo chmod 666 "$LOG_FILE"

# Java アプリケーションをバックグラウンドで実行し、ログを日時付きのファイルに出力
nohup java -jar /opt/zer0/ila-backend.war --spring.profiles.active=prod >> "$LOG_FILE" 2>&1 &

# 実行結果を確認
if [ $? -eq 0 ]; then
  echo "Application started successfully. Logs are being written to $LOG_FILE"
else
  echo "Failed to start application."
fi