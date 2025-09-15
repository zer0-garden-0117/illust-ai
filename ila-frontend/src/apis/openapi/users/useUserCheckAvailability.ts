import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type UserCheckAvailabilityHeaders = AuthHeader;
export type UserCheckAvailabilityArgs = {
  headers?: UserCheckAvailabilityHeaders;
  customUserId: operations["checkUserAvailability"]["parameters"]["path"]["customUserId"];
};

export const useUserCheckAvailability = (
  options?: SWRMutationConfiguration<
    boolean,
    Error,
    string,
    UserCheckAvailabilityArgs
  >
): SWRMutationResponse<boolean, Error, string, UserCheckAvailabilityArgs> => {
  return useSWRMutation<boolean, Error, string, UserCheckAvailabilityArgs>(
    `/users/{customUserId}`,
    async (_, { arg: { headers, customUserId } }): Promise<boolean> => {
      const { response } = await client.HEAD(
        `/users/{customUserId}`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`
          },
          params: {
            path: { customUserId }
          }
        }
      );
      const userAvailableHeader = response.headers.get('x-user-available');
      return userAvailableHeader === 'true';
    },
    options
  );
};