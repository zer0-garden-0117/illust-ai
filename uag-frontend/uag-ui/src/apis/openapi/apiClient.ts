import createClient, { ClientOptions, type Middleware } from "openapi-fetch";
import type { paths } from "../../generated/services/uag-v1";

export interface AccessTokenHeader {
  "x-access-token"?: string;
}

export interface MemberTokenHeader {
  Authorization: `Bearer ${string}`;
}

export interface CsrfTokenHeader {
  "x-xsrf-token"?: string;
}

const throwOnError: Middleware = {
  async onResponse(res) {
    const response = res.response;
    if (response.status >= 400) {
      const body = response.headers.get("content-type")?.includes("json")
        ? await response.clone().json()
        : await response.clone().text();
      throw new Error(body);
    }
    return undefined;
  },
};

// CSRFトークンを含めるためにcredentialsを設定
const customFetch: ClientOptions["fetch"] = (request) => {
  return fetch(request, { credentials: 'include' });
};

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  fetch: customFetch
});

client.use(throwOnError);

export default client;