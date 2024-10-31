import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkGetByIdResult = operations["getWorksById"]["responses"]["200"]["content"]["application/json"];
export type WorkGetByIdPath = operations["getWorksById"]["parameters"]["path"];
export type WorkGetByIdArgs = {
  workId: WorkGetByIdPath["workId"];
};

export const useWorksGetById = (
  options?: SWRMutationConfiguration<
    WorkGetByIdResult,
    Error,
    string,
    WorkGetByIdArgs
  >
): SWRMutationResponse<WorkGetByIdResult, Error, string, WorkGetByIdArgs> => {
  return useSWRMutation<WorkGetByIdResult, Error, string, WorkGetByIdArgs>(
    `/works/{workId}`,
    async (_, { arg: { workId } }): Promise<WorkGetByIdResult> => {
      const { data, error } = await client.GET(
        `/works/{workId}`,
        {
          params: {
            path: {
              workId: workId,
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