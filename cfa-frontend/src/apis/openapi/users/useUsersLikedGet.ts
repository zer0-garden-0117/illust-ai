import useSWR from 'swr';
import client from "../apiClient";
import type { UserTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/cfa-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type UsersLikedGetResult = operations["getUsersLiked"]["responses"]["200"]["content"]["application/json"];
export type UsersLikedGetHeader = UserTokenHeader;
export type UsersLikedGetQuery = operations["getUsersLiked"]["parameters"]["query"];

export type UsersLikedGetArgs = {
  headers?: UsersLikedGetHeader;
  query: UsersLikedGetQuery,
};

export const useUsersLikedGet = (
  options?: SWRMutationConfiguration<
    UsersLikedGetResult,
    Error,
    string,
    UsersLikedGetArgs
  >
): SWRMutationResponse<UsersLikedGetResult, Error, string, UsersLikedGetArgs> => {
  return useSWRMutation<UsersLikedGetResult, Error, string, UsersLikedGetArgs>(
    `/users/liked`,
    async (_, { arg: { headers, query } }): Promise<UsersLikedGetResult> => {
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