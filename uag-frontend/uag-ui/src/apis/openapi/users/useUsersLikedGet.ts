import useSWR from 'swr';
import client from "../apiClient";
import type { UserTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type UsersLikedGetResult = operations["getUsersLiked"]["responses"]["200"]["content"]["application/json"];
export type UsersLikedGetHeader = UserTokenHeader;
export type UsersLikedGetQuery = operations["getUsersLiked"]["parameters"]["query"];

export const useUsersLikedGet = (
  headers: UsersLikedGetHeader,
  query: UsersLikedGetQuery,
  options?: SWRConfiguration<UsersLikedGetResult, Error>
): SWRResponse<UsersLikedGetResult, Error> => {
  return useSWR<UsersLikedGetResult, Error>(
    `/users/liked`,
    async (): Promise<UsersLikedGetResult> => {
      const { data, error } = await client.GET(
        `/users/liked`,
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