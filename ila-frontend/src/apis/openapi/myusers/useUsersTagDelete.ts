import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type UsersTagDeleteResult =
  operations['deleteUsersTag']['responses']['200']['content']['application/json'];

export type UsersTagDeletePath = operations['deleteUsersTag']['parameters']['path'];

export type UsersTagDeleteArgs = {
  headers?: AuthHeader;
  tag: UsersTagDeletePath['tag'];
};

export const useUsersTagDelete = (
  options?: SWRMutationConfiguration<UsersTagDeleteResult, Error, string, UsersTagDeleteArgs>
): SWRMutationResponse<UsersTagDeleteResult, Error, string, UsersTagDeleteArgs> => {
  return useSWRMutation<UsersTagDeleteResult, Error, string, UsersTagDeleteArgs>(
    'myusers/tag/delete',
    async (_key, { arg }): Promise<UsersTagDeleteResult> => {
      const { data, error } = await client.DELETE('/myusers/tag/{tag}', {
        headers: {
          Authorization: `${arg?.headers?.Authorization}`,
        },
        params: {
          path: {
            tag: arg.tag,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    options
  );
};