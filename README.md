## UAG

## dev環境

### フロントエンド
- npm run devで下記を起動
  - next.js : https://localhost:3001 で起動 (.env.pdevelopment)

### バックエンド
- ./gradlew clean bootRunDevで下記の3つを起動
  - nginx : dockerで起動。https://localhostをhttp://localhost:8080にバイパス
  - db : DynamoDBLocal.jarで起動
  - spring : http://localhost:8080で起動(application-dev.yml)

## test環境　(AWS Staging環境)

### フロントエンド
- amplify.ymlで下記を起動
  - next.js : https://main.dikxsy3mbqtz7.amplifyapp.com (.env.test)

### バックエンド
- ALB : 
- db : 
- buildspec.ymlで下記を起動
  - spring

## prod環境 (AWS 本番環境)

#### フロントエンド
- 

#### バックエンド