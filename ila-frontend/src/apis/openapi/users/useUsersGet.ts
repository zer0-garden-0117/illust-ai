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
  args: UsersGetArgs | undefined,
  options?: SWRConfiguration<UsersGetResult, Error>
): SWRResponse<UsersGetResult, Error> => {
  const { customUserId, getIdTokenLatest } = args ?? {};

  return useSWR<UsersGetResult, Error>(
    customUserId ? ['/users', customUserId] : null,
    async ([, id]: [string, string]): Promise<UsersGetResult> => {

      let headers: Record<string, string> | undefined = undefined;  
      if (getIdTokenLatest) {
        const token = await getIdTokenLatest();
        if (token) {
          headers = { Authorization: `Bearer ${token}` };
        }
      }

      const { data, error } = await client.GET(
        `/users/{customUserId}`,
        {
          headers,
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