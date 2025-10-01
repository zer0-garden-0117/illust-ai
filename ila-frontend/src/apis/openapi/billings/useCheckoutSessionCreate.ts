import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from 'swr/mutation';
import client from '../apiClient';
import type { operations } from '../../../generated/services/ila-v1';
import type { AuthHeader } from '../apiClient';

export type CheckoutSessionCreateResult =
  operations['createCheckoutSession']['responses']['200']['content']['application/json'];

export type CheckoutSessionCreateBody =
  operations['createCheckoutSession']['requestBody']['content']['application/json'];

export type CheckoutSessionCreateArgs = {
  headers?: AuthHeader;
  body: CheckoutSessionCreateBody;
};

export const useCheckoutSessionCreate = (
  options?: SWRMutationConfiguration<
    CheckoutSessionCreateResult,
    Error,
    string,
    CheckoutSessionCreateArgs
  >
): SWRMutationResponse<
  CheckoutSessionCreateResult,
  Error,
  string,
  CheckoutSessionCreateArgs
> => {
  return useSWRMutation<
    CheckoutSessionCreateResult,
    Error,
    string,
    CheckoutSessionCreateArgs
  >(
    'billings/create-checkout-session',
    async (_key, { arg }): Promise<CheckoutSessionCreateResult> => {
      const { data, error } = await client.POST('/billings/create-checkout-session', {
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