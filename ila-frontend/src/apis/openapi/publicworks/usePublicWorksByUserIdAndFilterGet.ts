import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type UsersWorksGetResult =
  operations["getPublicWorksByUserIdAndFilter"]["responses"]["200"]["content"]["application/json"];
export type UsersWorks =
  operations["getPublicWorksByUserIdAndFilter"]["responses"]["200"]["content"]["application/json"]["works"];

export type UsersWorksGetPath = operations["getPublicWorksByUserIdAndFilter"]["parameters"]["path"];
export type UsersWorksGetQuery = operations["getPublicWorksByUserIdAndFilter"]["parameters"]["query"];

export type UsersWorksGetArgs = {
  customUserId: UsersWorksGetPath["customUserId"];
  offset: UsersWorksGetQuery["offset"];
  limit: UsersWorksGetQuery["limit"];
  userWorksFilterType: UsersWorksGetQuery["publicWorksUserFilterType"];
};

export const usePublicWorksByUserIdAndFilterGet = (
  args: UsersWorksGetArgs,
  options?: SWRConfiguration<UsersWorksGetResult, Error>
): SWRResponse<UsersWorksGetResult, Error> => {
  const { customUserId, offset, limit, userWorksFilterType } = args ?? {};

  return useSWR<UsersWorksGetResult, Error>(
    customUserId
      ? ["/public/works/user/{customUserId}", customUserId, offset, limit, userWorksFilterType]
      : null,
    async ([, id, off, lim, filterType]: [
      string,
      UsersWorksGetPath["customUserId"],
      UsersWorksGetQuery["offset"],
      UsersWorksGetQuery["limit"],
      UsersWorksGetQuery["publicWorksUserFilterType"]
    ]): Promise<UsersWorksGetResult> => {

      const { data, error } = await client.GET("/public/works/user/{customUserId}", {
        params: {
          path: { customUserId: id },
          query: {
            offset: off,
            limit: lim,
            publicWorksUserFilterType: filterType,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};