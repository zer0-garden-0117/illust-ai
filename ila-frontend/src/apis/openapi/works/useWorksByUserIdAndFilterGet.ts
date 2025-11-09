import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type UsersWorksGetResult =
  operations["getWorksByUserIdAndFilter"]["responses"]["200"]["content"]["application/json"];
export type UsersWorks =
  operations["getWorksByUserIdAndFilter"]["responses"]["200"]["content"]["application/json"]["works"];

export type UsersWorksGetPath = operations["getWorksByUserIdAndFilter"]["parameters"]["path"];
export type UsersWorksGetQuery = operations["getWorksByUserIdAndFilter"]["parameters"]["query"];

export type UsersWorksGetArgs = {
  customUserId: UsersWorksGetPath["customUserId"];
  offset: UsersWorksGetQuery["offset"];
  limit: UsersWorksGetQuery["limit"];
  userWorksFilterType: UsersWorksGetQuery["worksUserFilterType"];
  getIdTokenLatest: () => Promise<string | null>;
};

export const useUsersWorksGet = (
  args: UsersWorksGetArgs,
  options?: SWRConfiguration<UsersWorksGetResult, Error>
): SWRResponse<UsersWorksGetResult, Error> => {
  const { customUserId, offset, limit, userWorksFilterType, getIdTokenLatest } = args ?? {};

  return useSWR<UsersWorksGetResult, Error>(
    customUserId
      ? ["/works/user/{customUserId}", customUserId, offset, limit, userWorksFilterType]
      : null,
    async ([, id, off, lim, filterType]: [
      string,
      UsersWorksGetPath["customUserId"],
      UsersWorksGetQuery["offset"],
      UsersWorksGetQuery["limit"],
      UsersWorksGetQuery["worksUserFilterType"]
    ]): Promise<UsersWorksGetResult> => {
      const token = await getIdTokenLatest();
      if (!token) throw new Error("Failed to acquire latest ID token");

      const { data, error } = await client.GET("/works/user/{customUserId}", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          path: { customUserId: id },
          query: {
            offset: off,
            limit: lim,
            worksUserFilterType: filterType,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};