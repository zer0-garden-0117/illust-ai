import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/cfa-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type UsersActivitySearchResult = operations["postUsersActivitySearch"]["responses"]["200"]["content"]["application/json"];
export type UsersActivitySearchRequestBody = operations["postUsersActivitySearch"]["requestBody"]["content"]["application/json"];
export type UsersActivitySearchHeaders = UserTokenHeader & CsrfTokenHeader;
export type UsersActivitySearchArgs = {
  headers?: UsersActivitySearchHeaders;
  body: UsersActivitySearchRequestBody;
};

export const useUsersActivitySearch = (
  options?: SWRMutationConfiguration<
    UsersActivitySearchResult,
    Error,
    string,
    UsersActivitySearchArgs
  >
): SWRMutationResponse<UsersActivitySearchResult, Error, string, UsersActivitySearchArgs> => {
  return useSWRMutation<UsersActivitySearchResult, Error, string, UsersActivitySearchArgs>(
    `/users/activity/search`,
    async (_, { arg: { headers, body } }): Promise<UsersActivitySearchResult> => {
      const { data, error } = await client.POST(
        `/users/activity/search`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          body: body
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