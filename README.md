# Angel Sandbox

## 主な機能
 - 画像の投稿 (S3保存)
 - 画像のタグ管理 (dynamodb)
 - 画像のグリッド表示、詳細表示
 - 会員機能
   - ソーシャルログイン (Google連携)
   - 画像にいいね、レーティング付与
   - 画像のダウンロード

## 構成
 - バックエンド
   - Spring Boot (Kotlin)
   - nginx (HTTPS用)
   - dynamodb
   - S3
   - NodeJS (sharpでavifに変換)
   - AWS Secrets Manager
 - フロントエンド
   - Next.js (Typescript)
   - Mantine UI
   - Cognito

## コントリビュート
 - バグ報告・機能提案はIssueへ、コード変更はPRでお願いします。 

## ライセンス
 -  [MIT License](https://github.com/zer0-garden-0117/angel-sandbox/blob/main/LICENSE) 
