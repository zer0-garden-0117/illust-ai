import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/cfa-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type DeleteRatedResult = operations["deleteUsersRatedByWorkdId"]["responses"]["200"]["content"]["application/json"];
export type DeleteRatedHeaders = UserTokenHeader & CsrfTokenHeader;

export type DeleteRatedArgs = {
  headers?: DeleteRatedHeaders;
  workId: string;
};

export const useUsersRatedDelete = (
  options?: SWRMutationConfiguration<
    DeleteRatedResult,
    Error,
    string,
    DeleteRatedArgs
  >
): SWRMutationResponse<DeleteRatedResult, Error, string, DeleteRatedArgs> => {
  return useSWRMutation<DeleteRatedResult, Error, string, DeleteRatedArgs>(
    `/users/rated/{workId}`,
    async (url, { arg: { workId, headers } }): Promise<DeleteRatedResult> => {
      const { data, error } = await client.DELETE(
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