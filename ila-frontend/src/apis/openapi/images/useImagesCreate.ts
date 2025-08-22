import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { CsrfTokenHeader, UserTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type ImagesCreateResult = operations["createImages"]["responses"]["200"]["content"]["application/json"];
export type ImagesCreateBody = operations["createImages"]["requestBody"]["content"]["application/json"];
export type ImagesCreateHeaders = UserTokenHeader & CsrfTokenHeader;

export type ImagesCreateArgs = {
  body: ImagesCreateBody;
  headers?: ImagesCreateHeaders;
};

export const useImagesCreate = (
  options?: SWRMutationConfiguration<
    ImagesCreateResult,
    Error,
    string,
    ImagesCreateArgs
  >
): SWRMutationResponse<ImagesCreateResult, Error, string, ImagesCreateArgs> => {
  return useSWRMutation<ImagesCreateResult, Error, string, ImagesCreateArgs>(
    `/images/create`,
    async (_, { arg: { headers, body } }): Promise<ImagesCreateResult> => {
      const { data, error } = await client.POST(
        `/images/create`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          body,
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