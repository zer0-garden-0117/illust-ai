# package.json,package-lock.jsonのデプロイ
scp -i asb-test.pem ../../asb-backend/node-scripts/package.json ec2-user@98.80.194.175:/opt/zer0/node-scripts/
scp -i asb-test.pem ../../asb-backend/node-scripts/package-lock.json ec2-user@98.80.194.175:/opt/zer0/node-scripts/

# scriptsのデプロイ
scp -i asb-test.pem -r ../../asb-backend/node-scripts/service ec2-user@98.80.194.175:/opt/zer0/node-scripts/