import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type WorksUpdateResult =
  operations['updateMyWorksById']['responses']['200']['content']['application/json'];
export type WorksUpdatePath = operations['updateMyWorksById']['parameters']['path'];
export type WorksUpdateBody =
  operations['updateMyWorksById']['requestBody']['content']['application/json'];

export type WorksUpdateArgs = {
  headers?: AuthHeader;
  workId: WorksUpdatePath['workId'];
  body: WorksUpdateBody;
};

export const useMyWorksUpdate = (
  options?: SWRMutationConfiguration<WorksUpdateResult, Error, string, WorksUpdateArgs>
): SWRMutationResponse<WorksUpdateResult, Error, string, WorksUpdateArgs> => {
  return useSWRMutation<WorksUpdateResult, Error, string, WorksUpdateArgs>(
    'myworks/update',
    async (_key, { arg }): Promise<WorksUpdateResult> => {
      const { data, error } = await client.PATCH('/myworks/{workId}', {
        headers: arg?.headers
          ? { Authorization: `${arg.headers.Authorization}` }
          : undefined,
        params: {
          path: {
            workId: arg.workId,
          },
        },
        body: arg.body,
      });

      if (error) throw error;
      return data;
    },
    options
  );
};