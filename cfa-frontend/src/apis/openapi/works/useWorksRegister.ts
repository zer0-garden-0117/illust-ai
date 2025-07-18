import useSWRMutation from 'swr/mutation';
import client from "../apiClient";
import type { UserTokenHeader, CsrfTokenHeader } from '../apiClient';
import type { operations } from "../../../generated/services/cfa-v1";
import type { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';

export type RegisterWorkResult = operations["registerWorks"]["responses"]["200"]["content"]["application/json"];
export type RegisterWorkRequestBody = operations["registerWorks"]["requestBody"]["content"]["multipart/form-data"]
export type RegisterWorkHeaders = UserTokenHeader & CsrfTokenHeader;

export type RegisterWorkArgs = {
  headers?: RegisterWorkHeaders;
  body: RegisterWorkRequestBody;
};

export const useWorksRegister = (
  options?: SWRMutationConfiguration<
    RegisterWorkResult,
    Error,
    string,
    RegisterWorkArgs
  >
): SWRMutationResponse<RegisterWorkResult, Error, string, RegisterWorkArgs> => {
  return useSWRMutation<RegisterWorkResult, Error, string, RegisterWorkArgs>(
    `/works`,
    async (_, { arg: { headers, body } }): Promise<RegisterWorkResult> => {
      const { data, error } = await client.POST(
        `/works`,
        {
          headers: {
            Authorization: `${headers?.Authorization}`,
            "x-xsrf-token": headers?.["x-xsrf-token"] || '',
          },
          body: {
            titleImage: body.titleImage,
            images: body.images,
            worksDetailsBase64: body.worksDetailsBase64
          },
          bodySerializer: (body) => {
            const fd = new FormData();

            // titleImageをFormDataに追加
            if (body.titleImage) {
              fd.append('titleImage', body.titleImage);
            }

            // imagesをFormDataに追加（複数画像対応）
            if (Array.isArray(body.images)) {
              body.images.forEach((image) => {
                fd.append('images', image);
              });
            }

            // worksDetailsBase64をFormDataに追加
            if (body.worksDetailsBase64) {
              fd.append('worksDetailsBase64', body.worksDetailsBase64);
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