import { useEffect, useState } from 'react';
import { useAccessToken } from './useAccessToken';
import {
  UserTokenGetHeader, useUsersTokenGet, UserTokenGetResult
} from '../openapi/users/useUsersTokenGet';
import {
  getUserTokenFromCookies, setUserTokenToCookies
} from '../../utils/authCookies';
import { decodeUserToken } from '../../utils/authJwt';
import { useError } from "../../providers/error/errorProvider";

export const useUserToken = () => {
  const initialUserToken = getUserTokenFromCookies();
  const { userId: initialUserId, role: initialRole } = decodeUserToken(initialUserToken || '');
  const [userToken, setUserToken] = useState<string | null>(initialUserToken);
  const [userId, setUserId] = useState<number | null>(Number(initialUserId));
  const [role, setRole] = useState<string | null>(initialRole);
  const [isSetup, setIsSetup] = useState<boolean>(false);
  const { accessToken } = useAccessToken();
  const { setError } = useError();

  // `accessToken` がある場合にのみ `useUsersTokenGet` を実行
  const userTokenHeaders: UserTokenGetHeader = { "x-access-token": `${accessToken}` };
  const { data, error } = useUsersTokenGet(userTokenHeaders, {
    fallbackData: null as unknown as UserTokenGetResult,
  });

  useEffect(() => {
    if (error) {
      setError("Error fetching user token");
    }

    if (data?.userToken) {
      const { userId, role } = decodeUserToken(data.userToken);
      setUserToken(data.userToken);
      setUserId(Number(userId));
      setRole(role);
      setUserTokenToCookies(data.userToken);
    }
  }, [data, error, setError]);

  return { isSetup, userToken, userId, role, error };
};