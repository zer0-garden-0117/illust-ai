import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from 'swr/infinite';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';

export type WorksGetResult =
  operations['getWorksByFilter']['responses']['200']['content']['application/json'];
export type Works =
  operations['getWorksByFilter']['responses']['200']['content']['application/json']['works'];

export type WorksGetPath = operations['getWorksByFilter']['parameters']['path'];
export type WorksGetQuery = operations['getWorksByFilter']['parameters']['query'];

export type WorksGetInfiniteArgs = {
  initialOffset?: WorksGetQuery['offset'];
  limit: WorksGetQuery['limit'];
  worksFilterType: WorksGetQuery['worksFilterType'];
  getIdTokenLatest: () => Promise<string | null>;
};

export const useWorksGetByFilterInfinite = (
  args: WorksGetInfiniteArgs,
  options?: SWRInfiniteConfiguration<WorksGetResult, Error>
): SWRInfiniteResponse<WorksGetResult, Error> => {
  const {
    initialOffset = 0,
    limit,
    worksFilterType,
    getIdTokenLatest,
  } = args;

  const getKey = (
    pageIndex: number,
    previousPageData: WorksGetResult | null
  ) => {
    // 前ページで作品が0件ならこれ以上取得しない
    if (previousPageData && previousPageData.works?.length === 0) {
      return null;
    }

    const offset = initialOffset + pageIndex * limit;
    return ['/works', offset, limit, worksFilterType] as const;
  };

  const fetcher = async (
    [, off, lim, filterType]: [
      string,
      WorksGetQuery['offset'],
      WorksGetQuery['limit'],
      WorksGetQuery['worksFilterType']
    ]
  ): Promise<WorksGetResult> => {
    const token = await getIdTokenLatest();
    if (!token) throw new Error('Failed to acquire latest ID token');

    const { data, error } = await client.GET('/works', {
      headers: { Authorization: `Bearer ${token}` },
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

  return useSWRInfinite<WorksGetResult, Error>(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: false,
    ...options,
  });
};