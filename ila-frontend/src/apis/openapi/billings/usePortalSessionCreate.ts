import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type PortalSessionCreateResult =
  operations['createPortalSession']['responses']['200']['content']['application/json'];

export type PortalSessionCreateBody =
  operations['createPortalSession']['requestBody']['content']['application/json'];

export type PortalSessionCreateArgs = {
  headers?: AuthHeader;
  body: PortalSessionCreateBody;
};

export const usePortalSessionCreate = (
  options?: SWRMutationConfiguration<
    PortalSessionCreateResult,
    Error,
    string,
    PortalSessionCreateArgs
  >
): SWRMutationResponse<
  PortalSessionCreateResult,
  Error,
  string,
  PortalSessionCreateArgs
> => {
  return useSWRMutation<
    PortalSessionCreateResult,
    Error,
    string,
    PortalSessionCreateArgs
  >(
    'billings/create-portal-session',
    async (_key, { arg }): Promise<PortalSessionCreateResult> => {
      const { data, error } = await client.POST('/billings/create-portal-session', {
        headers: {
          Authorization: `${arg?.headers?.Authorization}`,
        },
        body: arg.body,
      });

      if (error) throw error;
      return data;
    },
    options
  );
};