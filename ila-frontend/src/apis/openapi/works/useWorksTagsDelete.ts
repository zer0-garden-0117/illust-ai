import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type WorksTagsDeleteResult = operations["deleteTagsById"]["responses"]["200"]["content"]["application/json"];
export type WorksTagsDeletePath = operations["deleteTagsById"]["parameters"]["path"];
export type WorksTagsDeleteHeaders = AuthHeader;

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
            Authorization: `${headers?.Authorization}`
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