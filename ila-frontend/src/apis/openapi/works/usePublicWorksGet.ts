import useSWR from 'swr';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { SWRConfiguration, SWRResponse } from 'swr';

export type PublicWorksGetResult =
  operations['getPublicWorks']['responses']['200']['content']['application/json'];
export type PublicWorks =
  operations['getPublicWorks']['responses']['200']['content']['application/json']['works'];

export type PublicWorksGetQuery = operations['getPublicWorks']['parameters']['query'];

export type PublicWorksGetArgs = {
  offset: PublicWorksGetQuery['offset'];
  limit: PublicWorksGetQuery['limit'];
  worksFilterType: PublicWorksGetQuery['worksFilterType'];
};

export const usePublicWorksGet = (
  args: PublicWorksGetArgs,
  options?: SWRConfiguration<PublicWorksGetResult, Error>
): SWRResponse<PublicWorksGetResult, Error> => {
  const { offset, limit, worksFilterType } = args ?? {};

  return useSWR<PublicWorksGetResult, Error>(
    ['/public/works', offset, limit, worksFilterType],
    async ([, off, lim, filterType]: [
      string,
      PublicWorksGetQuery['offset'],
      PublicWorksGetQuery['limit'],
      PublicWorksGetQuery['worksFilterType']
    ]): Promise<PublicWorksGetResult> => {
      const { data, error } = await client.GET('/public/works', {
        params: {
          query: {
            offset: off,
            limit: lim,
            worksFilterType: filterType,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};