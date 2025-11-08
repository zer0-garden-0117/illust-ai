import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from 'swr/infinite';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';

export type PublicWorksTagsGetResult =
  operations['getPublicWorksTags']['responses']['200']['content']['application/json'];

export type PublicWorksTags =
  operations['getPublicWorksTags']['responses']['200']['content']['application/json']['works'];

export type PublicWorksTagsGetQuery =
  operations['getPublicWorksTags']['parameters']['query'];

export type PublicWorksTagsGetPath =
  operations['getPublicWorksTags']['parameters']['path'];

export type PublicWorksTagsGetInfiniteArgs = {
  initialOffset?: PublicWorksTagsGetQuery['offset'];
  limit: PublicWorksTagsGetQuery['limit'];
  tag: PublicWorksTagsGetPath['tag'];
};

export const usePublicWorksTagsGetInfinite = (
  args: PublicWorksTagsGetInfiniteArgs,
  options?: SWRInfiniteConfiguration<PublicWorksTagsGetResult, Error>
): SWRInfiniteResponse<PublicWorksTagsGetResult, Error> => {
  const {
    initialOffset = 0,
    limit,
    tag,
  } = args;

  const getKey = (
    pageIndex: number,
    previousPageData: PublicWorksTagsGetResult | null
  ) => {
    // 前ページが0件ならこれ以上取得しない
    if (previousPageData && previousPageData?.works?.length === 0) {
      return null;
    }

    const offset = initialOffset + pageIndex * limit;
    return ['/public/works/tags', tag, offset, limit] as const;
  };

  const fetcher = async (
    [, tg, off, lim]: [
      string,
      PublicWorksTagsGetPath['tag'],
      PublicWorksTagsGetQuery['offset'],
      PublicWorksTagsGetQuery['limit']
    ]
  ): Promise<PublicWorksTagsGetResult> => {
    const { data, error } = await client.GET('/public/works/tags/{tag}', {
      params: {
        path: {
          tag: tg,
        },
        query: {
          offset: off,
          limit: lim,
        },
      },
    });

    if (error) throw error;
    return data;
  };

  return useSWRInfinite<PublicWorksTagsGetResult, Error>(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: false,
    ...options,
  });
};