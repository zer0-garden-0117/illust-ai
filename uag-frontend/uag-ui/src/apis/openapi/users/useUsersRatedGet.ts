import useSWR from 'swr';
import client from "../apiClient";
import type { UserTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type UsersRatedGetResult = operations["getUsersRated"]["responses"]["200"]["content"]["application/json"];
export type UsersRatedGetHeader = UserTokenHeader;
export type UsersRatedGetQuery = operations["getUsersRated"]["parameters"]["query"];

export const useUsersRatedGet = (
  headers: UsersRatedGetHeader,
  query: UsersRatedGetQuery,
  options?: SWRConfiguration<UsersRatedGetResult, Error>
): SWRResponse<UsersRatedGetResult, Error> => {
  return useSWR<UsersRatedGetResult, Error>(
    async (): Promise<UsersRatedGetResult> => {
      const { data, error } = await client.GET(
        `/users/rated`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
          },
          params: {
            query: {
              offset: query.offset,
              limit: query.limit,
            },
          }
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