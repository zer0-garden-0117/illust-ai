import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';

export type UsersTagGetResult =
  operations['getUsersTag']['responses']['200']['content']['application/json'];

export type UsersTagGetPath = operations['getUsersTag']['parameters']['path'];

export type UsersTagGetArgs = {
  tag: UsersTagGetPath['tag'];
  getIdTokenLatest?: () => Promise<string | null>;
};

export const useUsersTagGet = (
  args: UsersTagGetArgs | undefined,
  options?: SWRConfiguration<UsersTagGetResult, Error>
): SWRResponse<UsersTagGetResult, Error> => {
  const { tag, getIdTokenLatest } = args ?? {};

  return useSWR<UsersTagGetResult, Error>(
    tag ? ['/myusers/tag', tag] : null,
    async ([, t]: [string, string]): Promise<UsersTagGetResult> => {
      let headers: Record<string, string> | undefined = undefined;

      if (getIdTokenLatest) {
        const token = await getIdTokenLatest();
        if (token) {
          headers = { Authorization: `Bearer ${token}` };
        }
      }

      const { data, error } = await client.GET('/myusers/tag/{tag}', {
        headers,
        params: {
          path: { tag: t },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};