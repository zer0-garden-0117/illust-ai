import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type PublicWorksGetByIdResult =
  operations["getPublicWorksById"]["responses"]["200"]["content"]["application/json"];

export type PublicWorksGetByIdPath =
  operations["getPublicWorksById"]["parameters"]["path"];

export type PublicWorksGetByIdArgs = {
  workId: PublicWorksGetByIdPath["workId"];
};

export const usePublicWorksById = (
  args: PublicWorksGetByIdArgs | undefined,
  options?: SWRConfiguration<PublicWorksGetByIdResult, Error>
): SWRResponse<PublicWorksGetByIdResult, Error> => {
  const { workId } = args ?? {};

  return useSWR<PublicWorksGetByIdResult, Error>(
    workId ? ['/public/works', workId] : null,
    async ([, id]: [string, string]): Promise<PublicWorksGetByIdResult> => {
      const { data, error } = await client.GET(
        "/public/works/{workId}",
        {
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