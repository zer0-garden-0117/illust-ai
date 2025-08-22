#!/bin/bash
# プロセスIDを取得し、実行中のアプリケーションを停止
APP_PID=$(pgrep -f 'java -jar /opt/zer0/ila-backend.war')
if [ -n "$APP_PID" ]; then
  echo "Stopping application with PID $APP_PID"
  kill -9 "$APP_PID"
else
  echo "No application process found to stop."
fi