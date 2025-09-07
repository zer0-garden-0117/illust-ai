import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorksTagsRegisterResult = operations["registerTags"]["responses"]["200"]["content"]["application/json"];
export type WorksTagsRegisterRequestBody = operations["registerTags"]["requestBody"]["content"]["application/json"];
export type WorksTagsRegisterHeaders = AuthHeader;

export type WorksTagsRegisterArgs = {
  headers?: WorksTagsRegisterHeaders;
  body: WorksTagsRegisterRequestBody;
};

export const useWorksTagsRegister = (
  options?: SWRMutationConfiguration<
    WorksTagsRegisterResult,
    Error,
    string,
    WorksTagsRegisterArgs
  >
): SWRMutationResponse<WorksTagsRegisterResult, Error, string, WorksTagsRegisterArgs> => {
  return useSWRMutation<WorksTagsRegisterResult, Error, string, WorksTagsRegisterArgs>(
    `/works/tags`,
    async (_, { arg: { headers, body } }): Promise<WorksTagsRegisterResult> => {
      const { data, error } = await client.POST(
        `/works/tags`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`
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