import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkDeleteByIdResult = operations["deleteWorksById"]["responses"]["200"]["content"]["application/json"];
export type WorkDeleteByIdPath = operations["deleteWorksById"]["parameters"]["path"];
export type WorkDeleteByIdHeaders = AuthHeader;

export type WorkDeleteByIdArgs = {
  workId: WorkDeleteByIdPath["workId"];
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
    `/works/{workId}`,
    async (_, { arg: { headers, workId } }): Promise<WorkDeleteByIdResult> => {
      const { data, error } = await client.DELETE(
        `/works/{workId}`,
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