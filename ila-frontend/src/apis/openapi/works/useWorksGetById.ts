import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type WorksGetByIdResult =
  operations["getWorksById"]["responses"]["200"]["content"]["application/json"];

export type WorksGetByIdPath = operations["getWorksById"]["parameters"]["path"];

export type WorksGetByIdArgs = {
  workId: WorksGetByIdPath["workId"];
  getIdTokenLatest?: () => Promise<string | null>;
};

export const useWorksGetById = (
  args: WorksGetByIdArgs | undefined,
  options?: SWRConfiguration<WorksGetByIdResult, Error>
): SWRResponse<WorksGetByIdResult, Error> => {
  console.log('useWorksGetById called with', args);
  const { workId, getIdTokenLatest } = args ?? {};

  return useSWR<WorksGetByIdResult, Error>(
    workId ? ['/works', workId] : null,
    async ([, id]: [string, string]): Promise<WorksGetByIdResult> => {
      let headers: Record<string, string> | undefined = undefined;

      if (getIdTokenLatest) {
        const token = await getIdTokenLatest();
        if (token) {
          headers = { Authorization: `Bearer ${token}` };
        }
      }

      const { data, error } = await client.GET(
        "/works/{workId}",
        {
          headers,
          params: {
            path: { workId: id },
          },
        }
      );

      if (error) throw error;
      return data;
    },
    options
  );
};