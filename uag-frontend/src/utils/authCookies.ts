import Cookies from 'js-cookie';

const COGNITO_IDENTITY_SERVICE_PROVIDER = 'CognitoIdentityServiceProvider';
const ACCESS_TOKEN_KEY = 'accessToken';
const USER_TOKEN_KEY = 'userToken';
const CSRF_TOKEN_KEY = 'XSRF-TOKEN';

export const setUserTokenToCookies = (token: string) => {
  Cookies.set(USER_TOKEN_KEY, token, { expires: 1 });
};

export const getUserTokenFromCookies = (): string | null => {
  return Cookies.get(USER_TOKEN_KEY) || null;
};

export const clearUserTokenFromCookies = () => {
  Cookies.remove(USER_TOKEN_KEY);
};

export const getAccessTokenFromCookies = (): string | null => {
  const cookies = Cookies.get() || {};
  const accessTokenKey = Object.keys(cookies).find(
    key => key.includes(COGNITO_IDENTITY_SERVICE_PROVIDER) && key.includes(ACCESS_TOKEN_KEY)
  );
  return accessTokenKey ? cookies[accessTokenKey] : null;
};

export const getCsrfTokenFromCookies = (): string | null => {
  const cookies = Cookies.get();
  const csrfTokenKey = Object.keys(cookies).find(
    key => key.includes(CSRF_TOKEN_KEY)
  );
  return csrfTokenKey ? cookies[csrfTokenKey] : null;
};