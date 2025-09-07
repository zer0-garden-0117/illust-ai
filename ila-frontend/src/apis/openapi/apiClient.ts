import createClient, { ClientOptions, type Middleware } from "openapi-fetch";
import type { paths } from "../../generated/services/ila-v1";

export interface AuthHeader {
  Authorization: `Bearer ${string}`;
}

const throwOnError: Middleware = {
  async onResponse(res) {
    const response = res.response;

    if (response.status >= 400) {
      const contentType = response.headers.get("content-type");

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
  return fetch(request, { credentials: 'include' });
};

const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  // fetch: customFetch
});

client.use(throwOnError);

export default client;