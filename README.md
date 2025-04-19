## Angel Sandbox

## dev環境

### フロントエンドの起動方法
#### 事前準備
 - cd asb-frontend
 - npm install
 - .env.exampleを参考に.env.develomentを作成
#### 起動
 - cd asb-frontend
 - npm run dev
 - https://localhost:3001 にアクセス

### バックエンドの起動方法
#### 事前準備
 - Docker Desktopを起動
 - SSL証明書(自己署名証明書)の設定
   - scripts/mkcertのkeystore.p12をインポート(macOSの場合、キーチェーンアクセスのシステムにインポート)し、常に信頼を設定)
 - バックエンドのNodeの設定
   - cd asb-backend/node-scripts
   - npm install
 - localのdbの初期化
   - scripts/uag_img_database/config.iniのENVIRONMENTでdevを設定
   - devにlocalのdbのURLを設定
   - create.shを実行
#### 起動
 - cd asb-backend
 - ./gradlew clean bootRunDevを実行すると下記の3つが起動する
  - lb : nginxをDockerコンテナとして起動
  - db : Amazon DynamoDBのローカル版をDockerコンテナとして起動
  - SpringBoot : http://localhost:8080

## test環境　(AWS Staging環境)

### フロントエンド
- amplify.ymlで下記を起動
  - next.js : https://main.dikxsy3mbqtz7.amplifyapp.com (.env.test)

### バックエンド
- CloudFront : https://uag-test-staging.click
- db : 
- buildspec.ymlで下記を起動
  - spring

## prod環境 (AWS 本番環境)

#### フロントエンド
- 

#### バックエンド
test9