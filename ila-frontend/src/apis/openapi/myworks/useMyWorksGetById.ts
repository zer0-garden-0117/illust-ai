import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type WorksGetByIdResult =
  operations["getMyWorksById"]["responses"]["200"]["content"]["application/json"];

export type WorksGetByIdPath = operations["getMyWorksById"]["parameters"]["path"];

export type WorksGetByIdArgs = {
  workId: WorksGetByIdPath["workId"];
  getIdTokenLatest?: () => Promise<string | null>;
};

export const useMyWorksGetById = (
  args: WorksGetByIdArgs | undefined,
  options?: SWRConfiguration<WorksGetByIdResult, Error>
): SWRResponse<WorksGetByIdResult, Error> => {
  const { workId, getIdTokenLatest } = args ?? {};

  return useSWR<WorksGetByIdResult, Error>(
    workId ? ['/myworks', workId] : null,
    async ([, id]: [string, string]): Promise<WorksGetByIdResult> => {
      let headers: Record<string, string> | undefined = undefined;

      if (getIdTokenLatest) {
        const token = await getIdTokenLatest();
        if (token) {
          headers = { Authorization: `Bearer ${token}` };
        }
      }

      const { data, error } = await client.GET(
        "/myworks/{workId}",
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