import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type UsersGetResult = operations["getUsers"]["responses"]["200"]["content"]["application/json"];
export type UsersGetPath = operations["getUsers"]["parameters"]["path"];


export type UsersGetArgs = {
  customUserId: UsersGetPath["customUserId"];
  getIdTokenLatest: () => Promise<string | null>;
};

export const useUsersGet = (
  args: UsersGetArgs,
  options?: SWRConfiguration<UsersGetResult, Error>
): SWRResponse<UsersGetResult, Error> => {
  const { customUserId, getIdTokenLatest } = args ?? {};

  return useSWR<UsersGetResult, Error>(
    customUserId ? ['/users', customUserId] : null,
    async ([, id]: [string, string]): Promise<UsersGetResult> => {
      const token = await getIdTokenLatest();
      if (!token) {
        throw new Error('Failed to acquire latest ID token');
      }

      const { data, error } = await client.GET(
        `/users/{customUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            path: {
              customUserId: id,
            },
          }
        }
      );

      if (error) throw error;
      return data;
    },
    options
  );
};