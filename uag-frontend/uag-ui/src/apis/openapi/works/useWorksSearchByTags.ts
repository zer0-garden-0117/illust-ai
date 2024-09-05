import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AccessTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkSearchByTagResult = operations["searchWorksByTags"]["responses"]["200"]["content"]["application/json"];
export type WorkSearchByTagRequestBody = operations["searchWorksByTags"]["requestBody"]["content"]["application/json"];
export type WorkSearchByTagHeaders = AccessTokenHeader & CsrfTokenHeader;
export type WorkSearchByTagArgs = {
  headers?: WorkSearchByTagHeaders;
  body: WorkSearchByTagRequestBody;
};

export const useWorksSearchByTags = (
  options?: SWRMutationConfiguration<
    WorkSearchByTagResult,
    Error,
    string,
    WorkSearchByTagArgs
  >
): SWRMutationResponse<WorkSearchByTagResult, Error, string, WorkSearchByTagArgs> => {
  return useSWRMutation<WorkSearchByTagResult, Error, string, WorkSearchByTagArgs>(
    `/works/serachByTags`,
    async (_, { arg: { headers, body } }): Promise<WorkSearchByTagResult> => {
      const { data, error } = await client.POST(
        `/works/serachByTags`,
        {
          headers: {
            "x-access-token": headers?.["x-access-token"] || '',
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          body: body,
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