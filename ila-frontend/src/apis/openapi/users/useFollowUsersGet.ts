import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type FollowUsersGetResult =
  operations["getFollowUsers"]["responses"]["200"]["content"]["application/json"];

export type FollowUsersGetPath = operations["getFollowUsers"]["parameters"]["path"];
export type FollowUsersGetQuery = operations["getFollowUsers"]["parameters"]["query"];

export type FollowUsersGetArgs = {
  customUserId: FollowUsersGetPath["customUserId"];
  offset: FollowUsersGetQuery["offset"];
  limit: FollowUsersGetQuery["limit"];
  followType: FollowUsersGetQuery["followType"];
  getIdTokenLatest: () => Promise<string | null>;
};

export const useFollowUsersGet = (
  args: FollowUsersGetArgs,
  options?: SWRConfiguration<FollowUsersGetResult, Error>
): SWRResponse<FollowUsersGetResult, Error> => {
  console.log('useFollowUsersGet called with', args)
  const { customUserId, offset, limit, followType, getIdTokenLatest } = args ?? {};

  return useSWR<FollowUsersGetResult, Error>(
    customUserId ? ['/users/follow', customUserId, offset, limit, followType] : null,
    async ([, id, off, lim]: [string, string, number, number]): Promise<FollowUsersGetResult> => {
      const token = await getIdTokenLatest();
      if (!token) throw new Error('Failed to acquire latest ID token');

      const { data, error } = await client.GET(
        "/users/follow/{customUserId}",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            path: {
              customUserId: id,
            },
            query: {
              offset: off,
              limit: lim,
              followType: followType,
            },
          },
        }
      );

      if (error) throw error;
      return data;
    },
    options
  );
};