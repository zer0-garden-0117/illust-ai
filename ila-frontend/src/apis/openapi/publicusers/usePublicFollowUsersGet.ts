import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type PublicFollowUsersGetResult =
  operations["getPublicFollowUsers"]["responses"]["200"]["content"]["application/json"];

export type PublicFollowUsersGetPath =
  operations["getPublicFollowUsers"]["parameters"]["path"];
export type PublicFollowUsersGetQuery =
  operations["getPublicFollowUsers"]["parameters"]["query"];

export type PublicFollowUsersGetArgs = {
  customUserId: PublicFollowUsersGetPath["customUserId"];
  offset: PublicFollowUsersGetQuery["offset"];
  limit: PublicFollowUsersGetQuery["limit"];
  followType: PublicFollowUsersGetQuery["followType"];
};

export const usePublicFollowUsersGet = (
  args: PublicFollowUsersGetArgs | undefined,
  options?: SWRConfiguration<PublicFollowUsersGetResult, Error>
): SWRResponse<PublicFollowUsersGetResult, Error> => {
  const { customUserId, offset, limit, followType } = args ?? {};

  return useSWR<PublicFollowUsersGetResult, Error>(
    customUserId
      ? ['/public/users/follow', customUserId, offset, limit, followType]
      : null,
    async ([, id, off, lim]: [string, string, number, number]): Promise<PublicFollowUsersGetResult> => {
      const { data, error } = await client.GET(
        "/public/users/follow/{customUserId}",
        {
          params: {
            path: {
              customUserId: id,
            },
            query: {
              offset: off,
              limit: lim,
              followType: followType!!,
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