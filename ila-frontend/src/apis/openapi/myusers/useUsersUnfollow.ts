import useSWRMutation, { type SWRMutationConfiguration, type SWRMutationResponse } from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type UsersUnfollowResult = operations['unfollowUsers']['responses']['200']['content']['application/json'];
export type UsersUnfollowPath = operations['unfollowUsers']['parameters']['path'];

export type UsersUnfollowArgs = {
  headers?: AuthHeader;
  userId: UsersUnfollowPath['userId'];
};

export const useUsersUnfollow = (
  options?: SWRMutationConfiguration<UsersUnfollowResult, Error, string, UsersUnfollowArgs>
): SWRMutationResponse<UsersUnfollowResult, Error, string, UsersUnfollowArgs> => {
  return useSWRMutation<UsersUnfollowResult, Error, string, UsersUnfollowArgs>(
    'myusers/unfollow',
    async (_key, { arg }): Promise<UsersUnfollowResult> => {
      const { data, error } = await client.DELETE('/myusers/follow/{userId}', {
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