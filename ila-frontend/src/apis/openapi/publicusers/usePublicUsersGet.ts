import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';

export type PublicUsersGetResult =
  operations['getPublicUsers']['responses']['200']['content']['application/json'];

export type PublicUsersGetPath = operations['getPublicUsers']['parameters']['path'];

export type PublicUsersGetArgs = {
  customUserId: PublicUsersGetPath['customUserId'];
};

export const usePublicUsersGet = (
  args: PublicUsersGetArgs | undefined,
  options?: SWRConfiguration<PublicUsersGetResult, Error>
): SWRResponse<PublicUsersGetResult, Error> => {
  const customUserId = args?.customUserId;

  const key = customUserId ? ['/public/users', customUserId] : null;

  return useSWR<PublicUsersGetResult, Error>(
    key,
    async ([, id]: [string, PublicUsersGetArgs['customUserId']]) => {
      const res = await client.GET('/public/users/{customUserId}', {
        params: {
          path: {
            customUserId: id,
          },
        },
      });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    options
  );
};