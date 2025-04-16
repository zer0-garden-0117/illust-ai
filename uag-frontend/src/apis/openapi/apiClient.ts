import createClient, { ClientOptions, type Middleware } from "openapi-fetch";
import type { paths } from "../../generated/services/uag-v1";

export interface AccessTokenHeader {
  "x-access-token"?: string;
}

export interface UserTokenHeader {
  Authorization: `Bearer ${string}`;
}

export interface CsrfTokenHeader {
  "x-xsrf-token"?: string;
}

const throwOnError: Middleware = {
  async onResponse(res) {
    const response = res.response;
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (response.status >= 400) {
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);

      const body = contentType?.includes("json")
        ? await response.clone().json()
        : await response.clone().text();

      console.error("Error response body:", body);

      throw new Error(
        contentType?.includes("json")
          ? JSON.stringify(body, null, 2)
          : body
      );
    }
    return undefined;
  },
};
// CSRFトークンを含めるためにcredentialsを設定
const customFetch: ClientOptions["fetch"] = (request) => {
  // request.bodyがFormDataかどうかを確認するログ
  if (request.body instanceof FormData) {
    console.log("Request body is FormData.");
  } else {
    console.log("Request body is NOT FormData. Actual type:", typeof request.body);
  }

  // リクエストボディの内容を出力
  if (request.body instanceof FormData) {
    console.log("Request body as FormData:");
    for (const [key, value] of request.body.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File name = ${value.name}, size = ${value.size}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  } else if (request.body) {
    console.log("Request body:", request.body);
  }

  return fetch(request, { credentials: 'include' });
};

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  fetch: customFetch
});

client.use(throwOnError);

export default client;