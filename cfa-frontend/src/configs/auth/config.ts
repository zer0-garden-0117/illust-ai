import { Amplify } from "aws-amplify";
import { CookieStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const oauthDomain = process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN;
const redirectSignIn = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN;
const redirectSignOut = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT;

if (!userPoolClientId || !userPoolId || !oauthDomain ||
  !redirectSignIn || !redirectSignOut
) {
  throw new Error('Required environment variables are missing.');
}
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: userPoolClientId,
      userPoolId: userPoolId,
      loginWith: {
        oauth: {
          domain: oauthDomain,
          scopes: ['openid email phone'],
          redirectSignIn: [redirectSignIn],
          redirectSignOut: [redirectSignOut],
          responseType: 'code',
        }
      }
    },
  }
});

// クッキーに認証トークンを取得するための設定
const cookieStorageOptions = {
  expires: 1, // 有効期限を設定
  secure: true, // HTTPSでのみクッキーを送信
  httpOnly: false, // バックエンドのAPI呼出に認証トークンを使用できるよう設定
  sameSite: 'strict' as any // CSRF対策
};
const cookieStorage = new CookieStorage(cookieStorageOptions);
cognitoUserPoolsTokenProvider.setKeyValueStorage(cookieStorage);

export { Amplify, cookieStorage };