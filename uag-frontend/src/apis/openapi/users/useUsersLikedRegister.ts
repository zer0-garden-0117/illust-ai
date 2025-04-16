import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type RegisterLikedResult = operations["postUsersLikedByWorkdId"]["responses"]["200"]["content"]["application/json"];
export type RegisterLikedHeaders = UserTokenHeader & CsrfTokenHeader;

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
    `/users/liked/{workId}`,
    async (url, { arg: { workId, headers } }): Promise<RegisterLikedResult> => {
      const { data, error } = await client.POST(
        `/users/liked/{workId}`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
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