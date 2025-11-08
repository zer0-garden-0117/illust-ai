import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type UserDeleteResult = operations["deleteMyUser"]["responses"]["200"]["content"]["application/json"];
export type UserDeleteHeaders = AuthHeader;

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
    `/me`,
    async (url, { arg: { headers } }): Promise<UserDeleteResult> => {
      const { data, error } = await client.DELETE(
        `/me`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
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