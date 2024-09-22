import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/uag-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type WorkGetByIdResult = operations["getWorksById"]["responses"]["200"]["content"]["application/json"];
export type WorkGetByIdPath = operations["getWorksById"]["parameters"]["path"];

export const useWorksGetById = (
  workId: WorkGetByIdPath["workId"],
  options?: SWRConfiguration<WorkGetByIdResult, Error>
): SWRResponse<WorkGetByIdResult, Error> => {
  return useSWR<WorkGetByIdResult, Error>(
    async (): Promise<WorkGetByIdResult> => {
      const { data, error } = await client.GET(
        `/works/{workId}`,
        {
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