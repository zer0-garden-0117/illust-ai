import useSWR from 'swr';
import client from "../apiClient";
import type { AccessTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/asb-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type WorksTagGetResult = operations["getTags"]["responses"]["200"]["content"]["application/json"];
export type WorksTagGetHeaders = AccessTokenHeader & CsrfTokenHeader;

export const useWorksTagsGet = (
  headers?: WorksTagGetHeaders,
  options?: SWRConfiguration<WorksTagGetResult, Error>
): SWRResponse<WorksTagGetResult, Error> => {
  return useSWR<WorksTagGetResult, Error>(
    `/works/tags`,
    async (): Promise<WorksTagGetResult> => {
      const { data, error } = await client.GET(
        `/works/tags`,
        {
          headers: {
            "x-access-token": headers?.["x-access-token"] || '',
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
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