import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AccessTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkSearchResult = operations["searchWorks"]["responses"]["200"]["content"]["application/json"];
export type WorkSearchRequestBody = operations["searchWorks"]["requestBody"]["content"]["application/json"]
export type WorkSearchHeaders = AccessTokenHeader & CsrfTokenHeader;
export type WorkSearchArgs = {
  headers?: WorkSearchHeaders;
  body: WorkSearchRequestBody;
};

export const useWorksSearch = (
  options?: SWRMutationConfiguration<
    WorkSearchResult,
    Error,
    string,
    WorkSearchArgs
  >
): SWRMutationResponse<WorkSearchResult, Error, string, WorkSearchArgs> => {
  return useSWRMutation<WorkSearchResult, Error, string, WorkSearchArgs>(
    `/works/search`,
    async (_, { arg: { headers, body } }): Promise<WorkSearchResult> => {
      const { data, error } = await client.POST(
        `/works/search`,
        {
          headers: {
            "x-access-token": headers?.["x-access-token"] || '',
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
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