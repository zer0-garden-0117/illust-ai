import useSWRMutation, { type SWRMutationConfiguration, type SWRMutationResponse } from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type UsersFollowResult = operations['followUsers']['responses']['200']['content']['application/json'];
export type UsersFollowPath = operations['followUsers']['parameters']['path'];

export type UsersFollowArgs = {
  headers?: AuthHeader;
  userId: UsersFollowPath['userId'];
};

export const useUsersFollow = (
  options?: SWRMutationConfiguration<UsersFollowResult, Error, string, UsersFollowArgs>
): SWRMutationResponse<UsersFollowResult, Error, string, UsersFollowArgs> => {
  return useSWRMutation<UsersFollowResult, Error, string, UsersFollowArgs>(
    'myusers/follow',
    async (_key, { arg }): Promise<UsersFollowResult> => {
      const { data, error } = await client.POST('/myusers/follow/{userId}', {
        headers: {
          Authorization: `${arg?.headers?.Authorization}`,
        },
        params: {
          path: {
            userId: arg.userId,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};
