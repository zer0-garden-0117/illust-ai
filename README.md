## UAG

## dev環境

### フロントエンド
- npm run devで下記を起動
  - next.js : https://localhost:3001 で起動 (.env.pdevelopment)

### バックエンド
- ローカルで起動の前にすること
  - Docker Desktopを起動
  - SSL証明書の自己署名証明書の設定
    - scripts/mkcertのkeystore.p12をインポート(macの場合キーチェーンアクセスのシステムにインポート)し、常に信頼を設定
  - uag-backend/node-scriptsのインストール
    - uag-backend/node-scripts配下でnpm install
  - localのdbの初期化
    - scripts/uag_img_database/config.iniでdevを設定
    - create.shを実行
- ./gradlew clean bootRunDevで下記の3つを起動
  - nginx : dockerで起動。https://localhostをhttp://localhost:8080にバイパス
  - db : DynamoDBLocal.jarで起動
  - spring : http://localhost:8080で起動(application-dev.yml)

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