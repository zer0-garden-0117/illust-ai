import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/cfa-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type RegisterRatedResult = operations["postUsersRatedByWorkdId"]["responses"]["200"]["content"]["application/json"];
export type RegisterRatedHeaders = UserTokenHeader & CsrfTokenHeader;

export type RegisterRatedArgs = {
  headers?: RegisterRatedHeaders;
  workId: string;
  rating: number;
};

export const useUsersRatedRegister = (
  options?: SWRMutationConfiguration<
    RegisterRatedResult,
    Error,
    string,
    RegisterRatedArgs
  >
): SWRMutationResponse<RegisterRatedResult, Error, string, RegisterRatedArgs> => {
  return useSWRMutation<RegisterRatedResult, Error, string, RegisterRatedArgs>(
    `/users/rated/{workId}`,
    async (url, { arg: { workId, rating, headers } }): Promise<RegisterRatedResult> => {
      const { data, error } = await client.POST(
        `/users/rated/{workId}`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          params: {
            path: {
              workId: workId
            },
          },
          body: {
            rating: rating
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