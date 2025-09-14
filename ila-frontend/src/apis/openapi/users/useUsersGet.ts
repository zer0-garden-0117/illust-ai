import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';
import type { AuthHeader } from '../apiClient';

export type UsersGetResult = operations["getUsers"]["responses"]["200"]["content"]["application/json"];
export type UsersGetPath = operations["getUsers"]["parameters"]["path"];
export type UserGetHeader = AuthHeader;

export type UsersGetArgs = {
  headers?: UserGetHeader,
  customUserId: UsersGetPath["customUserId"];
};

export const useUsersGet = (
  args: UsersGetArgs,
  options?: SWRConfiguration<UsersGetResult, Error>
): SWRResponse<UsersGetResult, Error> => {
  return useSWR<UsersGetResult, Error>(
    args.customUserId ? `/users/${args.customUserId}` : null,
    async (): Promise<UsersGetResult> => {
      const { data, error } = await client.GET(
        `/users/{customUserId}`,
        {
          headers: {
            Authorization: `${args?.headers?.Authorization}`,
          },
          params: {
            path: {
              customUserId: args.customUserId,
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