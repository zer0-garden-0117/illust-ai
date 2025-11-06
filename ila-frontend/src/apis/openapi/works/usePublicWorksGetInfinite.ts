import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from 'swr/infinite';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';

export type PublicWorksGetResult =
  operations['getPublicWorks']['responses']['200']['content']['application/json'];
export type PublicWorks =
  operations['getPublicWorks']['responses']['200']['content']['application/json']['works'];

export type PublicWorksGetQuery = operations['getPublicWorks']['parameters']['query'];

export type PublicWorksGetInfiniteArgs = {
  initialOffset?: PublicWorksGetQuery['offset'];
  limit: PublicWorksGetQuery['limit'];
  worksFilterType: PublicWorksGetQuery['worksFilterType'];
};

export const usePublicWorksGetInfinite = (
  args: PublicWorksGetInfiniteArgs,
  options?: SWRInfiniteConfiguration<PublicWorksGetResult, Error>
): SWRInfiniteResponse<PublicWorksGetResult, Error> => {
  const {
    initialOffset = 0,
    limit,
    worksFilterType,
  } = args;

  const getKey = (
    pageIndex: number,
    previousPageData: PublicWorksGetResult | null
  ) => {
    if (previousPageData && previousPageData?.works?.length === 0) {
      return null;
    }
    const offset = initialOffset + pageIndex * limit;
    return ['/public/works', offset, limit, worksFilterType] as const;
  };

  const fetcher = async (
    [, off, lim, filterType]: [
      string,
      PublicWorksGetQuery['offset'],
      PublicWorksGetQuery['limit'],
      PublicWorksGetQuery['worksFilterType']
    ]
  ): Promise<PublicWorksGetResult> => {
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
  };

  return useSWRInfinite<PublicWorksGetResult, Error>(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: false,
    ...options,
  });
};