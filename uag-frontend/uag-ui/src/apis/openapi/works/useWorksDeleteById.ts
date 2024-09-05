import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AccessTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkDeleteByIdResult = operations["deleteWorksById"]["responses"]["200"]["content"]["application/json"];
export type WorkDeleteByIdPath = operations["deleteWorksById"]["parameters"]["path"];
export type WorkDeleteByIdHeaders = AccessTokenHeader & CsrfTokenHeader;

export type WorkDeleteByIdArgs = {
  worksId: WorkDeleteByIdPath["worksId"];
  headers?: WorkDeleteByIdHeaders;
};

export const useWorksDeleteById = (
  options?: SWRMutationConfiguration<
    WorkDeleteByIdResult,
    Error,
    string,
    WorkDeleteByIdArgs
  >
): SWRMutationResponse<WorkDeleteByIdResult, Error, string, WorkDeleteByIdArgs> => {
  return useSWRMutation<WorkDeleteByIdResult, Error, string, WorkDeleteByIdArgs>(
    `/works/{worksId}`,
    async (_, { arg: { headers, worksId } }): Promise<WorkDeleteByIdResult> => {
      const { data, error } = await client.DELETE(
        `/works/{worksId}`,
        {
          headers: {
            "x-access-token": headers?.["x-access-token"] || '',
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          params: {
            path: {
              worksId: worksId
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