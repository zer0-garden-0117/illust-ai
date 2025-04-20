import useSWR from 'swr';
import client from "../apiClient";
import type { UserTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/asb-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type UsersRatedGetResult = operations["getUsersRated"]["responses"]["200"]["content"]["application/json"];
export type UsersRatedGetHeader = UserTokenHeader;
export type UsersRatedGetQuery = operations["getUsersRated"]["parameters"]["query"];

export type UsersRatedGetArgs = {
  headers?: UsersRatedGetHeader;
  query: UsersRatedGetQuery,
};

export const useUsersRatedGet = (
  options?: SWRMutationConfiguration<
    UsersRatedGetResult,
    Error,
    string,
    UsersRatedGetArgs
  >
): SWRMutationResponse<UsersRatedGetResult, Error, string, UsersRatedGetArgs> => {
  return useSWRMutation<UsersRatedGetResult, Error, string, UsersRatedGetArgs>(
    `/users/rated`,
    async (_, { arg: { headers, query } }): Promise<UsersRatedGetResult> => {
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