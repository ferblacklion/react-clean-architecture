import { IDictionary } from "../../../types/generic";
import { JSONValue } from "../../../types/json";
import { toQueryString } from "../../url/to-query-string/to-query-string";

export enum ERRORS {
  TAKE_TOO_LONG = "Request take too long to complete",
  TIME_OUT = "Request timeout",
}

export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export interface FetchJSONProps extends Omit<RequestInit, "body" | "headers"> {
  body?: JSONValue;
  token?: string;
  headers?: Record<string, string>;
  queryParams?: IDictionary<string | string[] | undefined>;
}

export interface FetchJSONError extends Error {
  status: number;
  statusText: string;
}

function buildFetchJSONError(
  message: string,
  status: number,
  statusText: string
): FetchJSONError {
  const error = new Error(message);

  Object.defineProperties(error, {
    status: {
      value: status,
    },
    statusText: {
      value: statusText,
    },
  });

  return error as FetchJSONError;
}

/**
 * Execute a HTTP request against a given endpoint using a JSON formatted payload.
 * @public
 *
 * @param endpoint - A url to execute the request against. If your endpoint contains a query string, you can pass it in the request configuration using the queryParams key.
 * @param param1 - The request configuration including headers, tokens, method, body as well as extra configuration used in native fetch function {@link RequestInit}
 * @param timeout - How much time (milliseconds) we should wait for the request to complete before giving up.
 *
 * @returns The response if request reached the endpoint otherwise this function will reject the request.
 *
 * @remarks
 * You should handle any HTTP error codes by using the `ok` or `status` field once the request is resolved. It's important also to validate
 * the type of the data returned as an empty `body` is considered as valid, if status is `200`.
 *
 * The queryParams key in the configuration object will take care of encoding the values properly.
 *
 * @example
 * ```ts
 * const getPosts = fetchJSON('https://jsonplaceholder.typicode.com/posts/1');
 *
 * const postPosts = fetchJSON('https://jsonplaceholder.typicode.com/posts', {
 *   body: {
 *     userId: 1,
 *     title: 'HC',
 *     body: 'Styleguide is cool',
 *   },
 * });
 *
 * const putPosts = fetchJSON('https://jsonplaceholder.typicode.com/posts/1', {
 *   body: {
 *     userId: 2,
 *     title: 'HC',
 *     body: 'Styleguide is awesome',
 *   },
 *   method: 'PUT',
 * });
 *
 * const patchPostsWithTokenAndHeaders = fetchJSON(
 *   'https://jsonplaceholder.typicode.com/posts/1',
 *   {
 *     body: {
 *       body: 'Talk is cheap show me the code',
 *     },
 *     method: 'PATCH',
 *     token: 'asfsdfdsfsadfasdfa',
 *     headers: {
 *       Accept: 'application/json',
 *     },
 *   },
 * );
 *
 * const getPostsWithQueryParameters = await fetchJSON('http://fake.com/foo', {
 *    queryParams: {
 *      email: 'hsimpson+existinguser@gmail.com',
 *      text: 'Hello Günter',
 *    },
 *  }); // URL will be encoded http://fake.com/foo?email=hsimpson%2Bexistinguser%40gmail.com&text=Hello%20G%C3%BCnter
 * ```
 */
async function fetchJSON<T>(
  endpoint: string,
  {
    body,
    token,
    headers: customHeaders,
    queryParams,
    ...customConfig
  }: FetchJSONProps = {},
  timeout?: number
): Promise<HttpResponse<T>> {
  const temp: RequestInit = { method: "GET" };
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    temp.method = "POST";
    temp.body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  let query = "";
  if (queryParams) {
    query = `?${toQueryString(queryParams)}`;
  }

  const config = {
    ...temp,
    headers: { ...headers, ...customHeaders },
    ...customConfig,
  };

  return new Promise<HttpResponse<T>>((resolve, reject) => {
    if (timeout !== undefined && timeout > 0) {
      setTimeout(() => {
        reject(buildFetchJSONError(ERRORS.TAKE_TOO_LONG, 408, ERRORS.TIME_OUT));
      }, timeout);
    }

    fetch(`${endpoint}${query}`, config).then(resolve, reject);
  }).then(async (response) => {
    if (!response.ok) {
      return Promise.reject(
        buildFetchJSONError(
          await response.text(),
          response.status,
          response.statusText
        )
      );
    }

    const contentType = response.headers.get("content-type");
    const isJsonType = contentType && contentType.includes("application/json");
    const parsedBodyPromise = isJsonType ? response.json() : response.text();
    response.parsedBody = await parsedBodyPromise;

    return response;
  });
}

export { fetchJSON };
