# package.json,package-lock.jsonのデプロイ
scp -i uag-test.pem ../../uag-backend/node-scripts/package.json ec2-user@98.80.194.175:/opt/zer0/node-scripts/
scp -i uag-test.pem ../../uag-backend/node-scripts/package-lock.json ec2-user@98.80.194.175:/opt/zer0/node-scripts/

# scriptsのデプロイ
scp -i uag-test.pem -r ../../uag-backend/node-scripts/service ec2-user@98.80.194.175:/opt/zer0/node-scripts/