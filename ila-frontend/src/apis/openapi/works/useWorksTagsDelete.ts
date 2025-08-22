import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AccessTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorksTagsDeleteResult = operations["deleteTagsById"]["responses"]["200"]["content"]["application/json"];
export type WorksTagsDeletePath = operations["deleteTagsById"]["parameters"]["path"];
export type WorksTagsDeleteHeaders = AccessTokenHeader & CsrfTokenHeader;

export type WorksTagsDeleteArgs = {
  headers?: WorksTagsDeleteHeaders;
  path: WorksTagsDeletePath
};

export const useWorksTagsDelete = (
  options?: SWRMutationConfiguration<
    WorksTagsDeleteResult,
    Error,
    string,
    WorksTagsDeleteArgs
  >
): SWRMutationResponse<WorksTagsDeleteResult, Error, string, WorksTagsDeleteArgs> => {
  return useSWRMutation<WorksTagsDeleteResult, Error, string, WorksTagsDeleteArgs>(
    `/works/tags/{tagId}`,
    async (_, { arg: { headers, path } }): Promise<WorksTagsDeleteResult> => {
      const { data, error } = await client.DELETE(
        `/works/tags/{tagId}`,
        {
          headers: {
            "x-access-token": headers?.["x-access-token"] || '',
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          params: {
            path: {
              tag: path.tag
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