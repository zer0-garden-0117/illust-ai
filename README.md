# Angel Sandbox

## asb-backendの起動
 - 下記の3つを起動します
   - db (dynamodb Docker)
   - lb (nginx Docker)
   - OpenApiを提供するSpringBootPJ

### 事前準備
 - db (dynamodb Docker)
   - テーブル生成スクリプトの設定
     - config.iniでENVIRONMENTとURLを設定
 - lb (nginx Docker)
   - SSL証明書(自己署名証明書)設定
     - cd asb-backend/nginx/certs
     - config.iniを設定してkeystore-gen.shを実行しasb.pem、asb-key.pem、asb-keystore.p12を生成
     - 生成したasb-keystgore.p12をインポート(macOSの場合、キーチェーンアクセスのシステムにインポート)
 - SpringbootPJ
   - Node.js パッケージインストール
     - cd asb/asb-backend/node-scripts
     - npm install
   - AWSの設定
     - Secretes Manager
       - dbの設定
         - dynamodbのURL、region
       - s3の設定
         - バケット名、region
       - カスタム認証トークン(JWT)
         - 著名(生成・検証)する際の秘密鍵(ランダムで推測困難な文字列)
         - 投稿を許可するユーザーID(CognitoのuserId)
     - Cognito
       - ユーザープールを作成しpoodIdを設定
   - 環境変数の設定
     - application-example.ymlを参考にapplication-dev.ymlを修正

### 起動方法
 - cd asb-backend
 - ./gradlew clean bootRunDevでdb、lb、springBootPJの3つが起動される

## asb-frontendの起動

### 事前準備
 - Node.js パッケージインストール
   - cd asb-frontend
   - npm install
 - AWSの設定
   - Cognito
     - asb-backendのAWSの設定で作成したユーザープールにアプリケーションクライアントを作成
     - Google認証、LINE認証を設定
 - 環境変数の設定
   - .env.exampleを参考に.env.develomentを作成

### 起動方法
 - npm run dev
 - https://localhost:3001 にアクセス
