import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type DeleteLikedResult = operations["deleteUsersLikedByWorkdId"]["responses"]["200"]["content"]["application/json"];
export type DeleteLikedHeaders = UserTokenHeader & CsrfTokenHeader;

export type DeleteLikedArgs = {
  headers?: DeleteLikedHeaders;
  workId: string;
};

export const useUsersLikedDelete = (
  options?: SWRMutationConfiguration<
    DeleteLikedResult,
    Error,
    string,
    DeleteLikedArgs
  >
): SWRMutationResponse<DeleteLikedResult, Error, string, DeleteLikedArgs> => {
  return useSWRMutation<DeleteLikedResult, Error, string, DeleteLikedArgs>(
    `/users/liked/{workId}`,
    async (url, { arg: { workId, headers } }): Promise<DeleteLikedResult> => {
      const { data, error } = await client.DELETE(
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