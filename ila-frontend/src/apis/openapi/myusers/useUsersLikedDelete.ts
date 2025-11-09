import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type DeleteLikedResult = operations["deleteUsersLikedByWorkdId"]["responses"]["200"]["content"]["application/json"];
export type DeleteLikedHeaders = AuthHeader;

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
    `/myusers/liked/{workId}`,
    async (url, { arg: { workId, headers } }): Promise<DeleteLikedResult> => {
      const { data, error } = await client.DELETE(
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