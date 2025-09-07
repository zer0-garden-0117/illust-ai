import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type CreateWorkResult = operations["createWorks"]["responses"]["200"]["content"]["application/json"];
export type CreateWorkRequestBody = operations["createWorks"]["requestBody"]["content"]["application/json"];
export type CreateWorkHeaders = AuthHeader;

export type CreateWorkArgs = {
  headers?: CreateWorkHeaders;
  body: CreateWorkRequestBody;
};

export const useWorksCreate = (
  options?: SWRMutationConfiguration<
    CreateWorkResult,
    Error,
    string,
    CreateWorkArgs
  >
): SWRMutationResponse<CreateWorkResult, Error, string, CreateWorkArgs> => {
  return useSWRMutation<CreateWorkResult, Error, string, CreateWorkArgs>(
    `/works/create`,
    async (_, { arg: { headers, body } }): Promise<CreateWorkResult> => {
      const { data, error } = await client.POST(
        `/works/create`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "Content-Type": "application/json",
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