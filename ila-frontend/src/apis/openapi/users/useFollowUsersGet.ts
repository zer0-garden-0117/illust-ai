import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';
import type { AuthHeader } from '../apiClient';

export type FollowUsersGetResult =
  operations["getFollowUsers"]["responses"]["200"]["content"]["application/json"];

export type FollowUsersGetPath = operations["getFollowUsers"]["parameters"]["path"];
export type FollowUsersGetQuery = operations["getFollowUsers"]["parameters"]["query"];
export type FollowUsersGetHeader = AuthHeader;

export type FollowUsersGetArgs = {
  headers?: FollowUsersGetHeader;
  customUserId: FollowUsersGetPath["customUserId"];
  offset: FollowUsersGetQuery["offset"];
  limit: FollowUsersGetQuery["limit"];
};

export const useFollowUsersGet = (
  args: FollowUsersGetArgs,
  options?: SWRConfiguration<FollowUsersGetResult, Error>
): SWRResponse<FollowUsersGetResult, Error> => {
  return useSWR<FollowUsersGetResult, Error>(
    args.customUserId ? [`/users/follow/${args.customUserId}`, args.offset, args.limit] : null,
    async (): Promise<FollowUsersGetResult> => {
      const { data, error } = await client.GET(
        "/users/follow/{customUserId}",
        {
          headers: {
            Authorization: `${args?.headers?.Authorization}`,
          },
          params: {
            path: {
              customUserId: args.customUserId,
            },
            query: {
              offset: args.offset,
              limit: args.limit,
            },
          },
        }
      );
      if (error) {
        throw error;
      }
      return data;
    },
    options
  );
};