## Angel Sandbox

### asb-backendの起動
 - 下記の3つを起動します
   - db (Docker)
   - lb (Docker)
   - OpenApiを提供するSpringBootPJ

#### 事前準備
 - db
   - Docker Desktopを起動
   - テーブル作成
     - cd asb-backend/db/scripts
     - config.iniのENVIRONMENTでdevを設定、devにlocalのdbのURLを設定
     - ./create.shでテーブル生成
 - lb
   - Docker Desktopを起動
   - SSL証明書(自己署名証明書)設定
     - cd asb-backend/nginx/certs
     - ./keystore-gen.sh
     - 生成したkeystore.p12をインポート(macOSの場合、キーチェーンアクセスのシステムにインポート)し、常に信頼を設定)
 - SpringbootPJ
   - NodeScriptsの初期化
     - cd asb-backend/node-scripts
     - npm install
   - 環境変数の設定
     - application-example.ymlを参考にapplication-dev.ymlを作成

#### 起動
 - cd asb-backend
 - ./gradlew clean bootRunDevで下記の3つが起動される
  - lb : nginxをDockerコンテナとして起動
  - db : Amazon DynamoDBのローカル版をDockerコンテナとして起動
  - SpringBootPJ : http://localhost:8080

### asb-frontendの起動

#### 事前準備
 - 環境変数の設定
   - .env.exampleを参考に.env.develomentを作成

#### 起動
 - cd asb-frontend
 - npm run dev
 - https://localhost:3001 にアクセス
