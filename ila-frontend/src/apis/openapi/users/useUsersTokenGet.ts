import useSWR from 'swr';
import client from "../apiClient";
import type { AccessTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';
import { getUserTokenFromCookies } from '../../../utils/authCookies';

export type UserTokenGetResult = operations["getUsersToken"]["responses"]["200"]["content"]["application/json"];
export type UserTokenGetHeader = AccessTokenHeader;

export const useUsersTokenGet = (
  headers: UserTokenGetHeader,
  options?: SWRConfiguration<UserTokenGetResult, Error>
): SWRResponse<UserTokenGetResult, Error> => {
  const accessToken = headers["x-access-token"] !== 'null' ? headers["x-access-token"] : null;
  const userToken = getUserTokenFromCookies();

  // 条件に基づいてリクエストを実行するか決定
  const shouldFetch = accessToken && !userToken ? `/users/token` : null;

  // `shouldFetch` が `null` の場合はリクエストをスキップ
  return useSWR<UserTokenGetResult, Error>(
    shouldFetch,
    async (): Promise<UserTokenGetResult> => {
      const { data, error } = await client.GET(
        `/users/token`,
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );
      if (error) {
        throw error;
      }
      return data;
    },
    options
  );
};