import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { CsrfTokenHeader, UserTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/asb-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type UserDeleteResult = operations["deleteUsers"]["responses"]["200"]["content"]["application/json"];
export type UserDeleteHeaders = UserTokenHeader & CsrfTokenHeader;

export type UserDeleteArgs = {
  headers: UserDeleteHeaders;
};

export const useUsersDelete = (
  options?: SWRMutationConfiguration<
    UserDeleteResult,
    Error,
    string,
    UserDeleteArgs
  >
): SWRMutationResponse<UserDeleteResult, Error, string, UserDeleteArgs> => {
  return useSWRMutation<UserDeleteResult, Error, string, UserDeleteArgs>(
    `/users`,
    async (url, { arg: { headers } }): Promise<UserDeleteResult> => {
      const { data, error } = await client.DELETE(
        `/users`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
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