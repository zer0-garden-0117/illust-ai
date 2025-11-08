import client from "../apiClient";
import type { AuthHeader } from '../apiClient';
import type { operations } from "../../../generated/services/ila-v1";
import useSWRMutation, { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type MyUserUpdateResult = operations["patchMyUser"]["responses"]["200"]["content"]["application/json"];
export type MyUserUpdateRequestBody = operations["patchMyUser"]["requestBody"]["content"]["multipart/form-data"]
export type MyUserUpdateHeader = AuthHeader;

export type MyUserUpdateArgs = {
  headers?: MyUserUpdateHeader;
  body: MyUserUpdateRequestBody;
};

export const useMyUserUpdate = (
  options?: SWRMutationConfiguration<
    MyUserUpdateResult,
    Error,
    string,
    MyUserUpdateArgs
  >
): SWRMutationResponse<MyUserUpdateResult, Error, string, MyUserUpdateArgs> => {
  return useSWRMutation<MyUserUpdateResult, Error, string, MyUserUpdateArgs>(
    `/me`,
    async (_, { arg }): Promise<MyUserUpdateResult> => {
      const { data, error } = await client.PATCH(
        `/me`,
        {
          headers: {
            Authorization: `${arg?.headers?.Authorization}`,
            'Content-Type': 'multipart/form-data',
          },
          body: arg.body,
          bodySerializer: (body) => {
            const fd = new FormData();
            // coverImageをFormDataに追加
            if (body.coverImage) {
              fd.append('coverImage', body.coverImage);
            }
            // profileImageをFormDataに追加
            if (body.profileImage) {
              fd.append('profileImage', body.profileImage);
            }
            // customUserIdをFormDataに追加
            if (body.customUserId) {
              fd.append('customUserId', body.customUserId);
            }
            // userNameをFormDataに追加
            if (body.userName) {
              fd.append('userName', body.userName);
            }
            // userProfileをFormDataに追加
            if (body.userProfile) {
              fd.append('userProfile', body.userProfile);
            }
            return fd;
          }
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