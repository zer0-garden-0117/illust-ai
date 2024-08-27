import { useState } from 'react';
import { useAccessToken } from './useAccessToken';
import {
  UserTokenGetHeader, useUsersTokenGet, UserTokenGetResult
} from '../openapi/users/useUsersTokenGet';
import {
  getUserTokenFromCookies, setUserTokenToCookies
} from '../../utils/authCookies';
import { decodeUserToken } from '../../utils/authJwt';
import { useError } from "../../providers/error/errorProvider"

export const useUserToken = () => {
  const initialUserToken = getUserTokenFromCookies();
  const { userId: initialUserId, role: initialRole } = decodeUserToken(initialUserToken || '');
  const [userToken, setUserToken] = useState<string | null>(initialUserToken);
  const [userId, setUserId] = useState<number | null>(Number(initialUserId));
  const [role, setRole] = useState<string | null>(initialRole);
  const [isSetup, setIsSetup] = useState<boolean>(false);
  const { accessToken } = useAccessToken();
  const userTokenHeaders: UserTokenGetHeader = { "x-access-token": `${accessToken}` };
  const { setError } = useError();

  const swrOptions = {
    fallbackData: null as unknown as UserTokenGetResult
  };
  const { data, error, isLoading } = useUsersTokenGet(userTokenHeaders, swrOptions);
  if (error) {
    setError("Error fetching user token");
  }

  // 未登録時の状態設定
  if (data?.userToken && !userToken) {
    if (data.userToken == "unregistered" && !isSetup) {
      setIsSetup(true);
    } else if (data.userToken != "unregistered" && isSetup) {
      setIsSetup(false);
    }
  }

  // メンバートークン、userID、roleの設定
  if (data?.userToken && !userToken && !isSetup) {
    const { userId, role } = decodeUserToken(data.userToken);
    if (userId && role) {
      setUserToken(data.userToken);
      setUserId(Number(userId));
      setRole(role);
      setUserTokenToCookies(data.userToken);
    } else {
      console.log('Invalid user token');
    }
  }
  return { isSetup, userToken, userId, role, error };
};
