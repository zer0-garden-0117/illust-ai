import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/asb-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorkSearchByTagResult = operations["searchWorksByTags"]["responses"]["200"]["content"]["application/json"];
export type WorkSearchByTagRequestBody = operations["searchWorksByTags"]["requestBody"]["content"]["application/json"];
export type WorkSearchByTagArgs = {
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
    `/works/searchByTags`,
    async (_, { arg: { body } }): Promise<WorkSearchByTagResult> => {
      const { data, error } = await client.POST(
        `/works/searchByTags`,
        {
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