import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type RegisterLikedResult = operations["postUsersLikedByWorkdId"]["responses"]["200"]["content"]["application/json"];
export type RegisterLikedHeaders = AuthHeader;

export type RegisterLikedArgs = {
  headers?: RegisterLikedHeaders;
  workId: string;
};

export const useUsersLikedRegister = (
  options?: SWRMutationConfiguration<
    RegisterLikedResult,
    Error,
    string,
    RegisterLikedArgs
  >
): SWRMutationResponse<RegisterLikedResult, Error, string, RegisterLikedArgs> => {
  return useSWRMutation<RegisterLikedResult, Error, string, RegisterLikedArgs>(
    `/myusers/liked/{workId}`,
    async (url, { arg: { workId, headers } }): Promise<RegisterLikedResult> => {
      const { data, error } = await client.POST(
        `/myusers/liked/{workId}`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`
          },
          params: {
            path: {
              workId: workId
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