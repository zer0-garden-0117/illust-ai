import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AccessTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/asb-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkUpdateByIdResult = operations["updateWorksById"]["responses"]["200"]["content"]["application/json"];
export type WorkUpdateByIdRequestBody = operations["updateWorksById"]["requestBody"]["content"]["application/json"];
export type WorkUpdateByIdPath = operations["updateWorksById"]["parameters"]["path"];
export type WorkUpdateByIdHeaders = AccessTokenHeader & CsrfTokenHeader;

export type WorkUpdateByIdArgs = {
  headers?: WorkUpdateByIdHeaders;
  workId: WorkUpdateByIdPath["workId"];
  body: WorkUpdateByIdRequestBody;
};

export const useWorksUpdateById = (
  options?: SWRMutationConfiguration<
    WorkUpdateByIdResult,
    Error,
    string,
    WorkUpdateByIdArgs
  >
): SWRMutationResponse<WorkUpdateByIdResult, Error, string, WorkUpdateByIdArgs> => {
  return useSWRMutation<WorkUpdateByIdResult, Error, string, WorkUpdateByIdArgs>(
    `/works/{workId}`,
    async (_, { arg: { headers, body, workId } }): Promise<WorkUpdateByIdResult> => {
      const { data, error } = await client.PUT(
        `/works/{workId}`,
        {
          headers: {
            "x-access-token": headers?.["x-access-token"] || '',
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          params: {
            path: {
              workId: workId
            },
          },
          body: body
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