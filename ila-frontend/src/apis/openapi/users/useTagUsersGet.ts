import useSWR from 'swr';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { SWRConfiguration, SWRResponse } from 'swr';

export type TagUsersGetResult =
  operations['getPublicTagUsers']['responses']['200']['content']['application/json'];

export type TagUsersGetPath = operations['getPublicTagUsers']['parameters']['path'];
export type TagUsersGetQuery = operations['getPublicTagUsers']['parameters']['query'];

export type TagUsersGetArgs = {
  customUserId: TagUsersGetPath['customUserId'];
  offset: TagUsersGetQuery['offset'];
  limit: TagUsersGetQuery['limit'];
  getIdTokenLatest: () => Promise<string | null>;
};

export const useTagUsersGet = (
  args: TagUsersGetArgs | undefined,
  options?: SWRConfiguration<TagUsersGetResult, Error>
): SWRResponse<TagUsersGetResult, Error> => {
  const { customUserId, offset, limit, getIdTokenLatest } = args ?? {};

  return useSWR<TagUsersGetResult, Error>(
    customUserId ? ['/public/users/tag', customUserId, offset, limit] : null,
    async ([, id, off, lim]: [string, string, number, number]): Promise<TagUsersGetResult> => {
      let headers: Record<string, string> | undefined = undefined;

      if (getIdTokenLatest) {
        const token = await getIdTokenLatest();
        if (token) {
          headers = { Authorization: `Bearer ${token}` };
        }
      }

      const { data, error } = await client.GET('/public/users/tag/{customUserId}', {
        headers,
        params: {
          path: {
            customUserId: id,
          },
          query: {
            offset: off,
            limit: lim,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};