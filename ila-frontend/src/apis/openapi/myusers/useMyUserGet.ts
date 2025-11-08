import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import useSWRMutation, { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type MyUserGetResult = operations["getMyUser"]["responses"]["200"]["content"]["application/json"];
export type MyUserGetHeader = AuthHeader;

export type MyUserGetArgs = {
  headers?: MyUserGetHeader;
};

export const useMyUserGet = (
  options?: SWRMutationConfiguration<
    MyUserGetResult,
    Error,
    string,
    MyUserGetArgs
  >
): SWRMutationResponse<MyUserGetResult, Error, string, MyUserGetArgs> => {
  return useSWRMutation<MyUserGetResult, Error, string, MyUserGetArgs>(
    `/me`,
    async (_, { arg }): Promise<MyUserGetResult> => {
      const { data, error } = await client.GET(
        `/me`,
        {
          headers: {
            Authorization: `${arg?.headers?.Authorization}`,
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