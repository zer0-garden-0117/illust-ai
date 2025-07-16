# Colorful AI

## 主な機能（予定）
 - 画像の生成
 - 画像の投稿 (S3保存)
 - 画像のタグ管理 (dynamodb)
 - 画像のグリッド表示、詳細表示
 - 会員機能
   - ソーシャルログイン (Google連携)
   - 画像にいいね、レーティング付与
   - 画像のダウンロード

## 構成（予定）
 - バックエンド
   - Spring Boot (Kotlin)
   - Bedrock
   - dynamodb
   - S3
   - NodeJS (sharpでavifに変換)
   - nginx (HTTP to HTTPS)

 - フロントエンド
   - Next.js (Typescript)
   - Mantine UI
   - Firebase

## 開発環境構築手順
 - バックエンド
   - Docker Desktop
     - docker-composeが使えるようにしておく
   - AWS CLI
   - SSL証明書(HTTP to HTTPS)の設定
     - mkcertのインストール
     - cd asb-backend/nginx/certs
     - config.iniを編集し、keystore-gen.shを実行し、asb-keysotre.p12をOSインポート
   - NodeJS for sharp(avif変換ライブラリ)
     - cd asb/backend/node-scripts
     - npm install
   - 起動
     - cd asb-backend
     - ./gradlew clean bootRunDev
 - フロントエンド
   - cd asb-frontend
   - npm install
   - npm run dev

## コントリビュート
 - バグ報告・機能提案はIssueへ、コード変更はPRでお願いします。 

## ライセンス
 -  [MIT License](https://github.com/zer0-garden-0117/colorful-ai/blob/main/LICENSE) 
