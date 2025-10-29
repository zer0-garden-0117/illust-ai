import useSWR from 'swr';
import client from "../apiClient";
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRConfiguration, SWRResponse } from 'swr';

export type UsersWorksGetResult =
  operations["getUsersWorks"]["responses"]["200"]["content"]["application/json"];
export type UsersWorks =
  operations["getUsersWorks"]["responses"]["200"]["content"]["application/json"]["works"];

export type UsersWorksGetPath = operations["getUsersWorks"]["parameters"]["path"];
export type UsersWorksGetQuery = operations["getUsersWorks"]["parameters"]["query"];

export type UsersWorksGetArgs = {
  customUserId: UsersWorksGetPath["customUserId"];
  offset: UsersWorksGetQuery["offset"];
  limit: UsersWorksGetQuery["limit"];
  userWorksFilterType: UsersWorksGetQuery["userWorksFilterType"];
  getIdTokenLatest: () => Promise<string | null>;
};

export const useUsersWorksGet = (
  args: UsersWorksGetArgs,
  options?: SWRConfiguration<UsersWorksGetResult, Error>
): SWRResponse<UsersWorksGetResult, Error> => {
  const { customUserId, offset, limit, userWorksFilterType, getIdTokenLatest } = args ?? {};

  return useSWR<UsersWorksGetResult, Error>(
    customUserId
      ? ["/users/works", customUserId, offset, limit, userWorksFilterType]
      : null,
    async ([, id, off, lim, filterType]: [
      string,
      UsersWorksGetPath["customUserId"],
      UsersWorksGetQuery["offset"],
      UsersWorksGetQuery["limit"],
      UsersWorksGetQuery["userWorksFilterType"]
    ]): Promise<UsersWorksGetResult> => {
      const token = await getIdTokenLatest();
      if (!token) throw new Error("Failed to acquire latest ID token");

      const { data, error } = await client.GET("/users/{customUserId}/works", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          path: { customUserId: id },
          query: {
            offset: off,
            limit: lim,
            userWorksFilterType: filterType,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};