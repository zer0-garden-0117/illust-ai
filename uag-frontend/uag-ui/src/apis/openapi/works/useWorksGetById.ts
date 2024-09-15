import useSWR from 'swr';
import client from "../apiClient";
import type { AccessTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type WorkGetByIdResult = operations["getWorksById"]["responses"]["200"]["content"]["application/json"];
export type WorkGetByIdHeader = AccessTokenHeader;
export type WorkGetByIdPath = operations["getWorksById"]["parameters"]["path"];

export const useWorksGetById = (
  headers: WorkGetByIdHeader,
  workId: WorkGetByIdPath["workId"],
  options?: SWRConfiguration<WorkGetByIdResult, Error>
): SWRResponse<WorkGetByIdResult, Error> => {
  const accessToken = headers["x-access-token"] !== 'null' ? headers["x-access-token"] : null;
  const shouldFetch = accessToken ? `/works/${workId}` : null;

  return useSWR<WorkGetByIdResult, Error>(
    shouldFetch,
    async (): Promise<WorkGetByIdResult> => {
      const { data, error } = await client.GET(
        `/works/{workId}`,
        {
          headers: {
            "x-access-token": accessToken,
          },
          params: {
            path: {
              workId: workId
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