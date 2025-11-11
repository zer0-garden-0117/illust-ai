import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type UsersTagPostResult =
  operations['postUsersTag']['responses']['200']['content']['application/json'];

export type UsersTagPostPath = operations['postUsersTag']['parameters']['path'];

export type UsersTagPostArgs = {
  headers?: AuthHeader;
  tag: UsersTagPostPath['tag'];
};

export const useUsersTagRegister = (
  options?: SWRMutationConfiguration<UsersTagPostResult, Error, string, UsersTagPostArgs>
): SWRMutationResponse<UsersTagPostResult, Error, string, UsersTagPostArgs> => {
  return useSWRMutation<UsersTagPostResult, Error, string, UsersTagPostArgs>(
    'myusers/tag',
    async (_key, { arg }): Promise<UsersTagPostResult> => {
      const { data, error } = await client.POST('/myusers/tag/{tag}', {
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