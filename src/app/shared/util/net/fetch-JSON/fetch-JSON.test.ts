import "isomorphic-fetch";

import type {
  ResponseComposition,
  ResponseResolver,
  RestContext,
  RestRequest,
} from "msw";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { ERRORS } from "./fetch-JSON";
import { fetchJSON } from "./fetch-JSON";

global.window = {
  fetch: global.fetch,
} as typeof global.window;

const defaultRequestResolver: ResponseResolver<RestRequest, RestContext> = (
  _req,
  res,
  ctx
) => {
  ctx.set("Content-Type", "application/json");
  return res(ctx.json({ one: "two" }));
};

// const fetchMock = vi
//   .fn<
//     ReturnType<typeof defaultRequestResolver>,
//     Parameters<typeof defaultRequestResolver>
//   >()
//   .mockImplementation(defaultRequestResolver);

const fetchMock = vi.fn().mockImplementation(defaultRequestResolver);

const server = setupServer(
  rest.get(/.*/gi, fetchMock as typeof defaultRequestResolver),
  rest.post(/.*/gi, fetchMock as typeof defaultRequestResolver),
  rest.patch(/.*/gi, fetchMock as typeof defaultRequestResolver)
);

describe("NET::fetch-JSON", () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    fetchMock.mockClear();
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("fetchJSON - should GET a JSON object from fake API", async () => {
    const response = await fetchJSON("https://fake.com");
    expect(response).toBeDefined();
    expect(response.parsedBody).toStrictEqual({ one: "two" });
  });

  test("fetchJSON - should GET a JSON object from fake API sending token", async () => {
    fetchMock.mockImplementation(
      (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        expect(req.headers.get("Authorization")).toBe("Bearer 12345");
        return defaultRequestResolver(req, res, ctx);
      }
    );

    const response = await fetchJSON("https://fake.com", {
      token: "12345",
    });

    expect(response).toBeDefined();
    expect(response.parsedBody).toStrictEqual({ one: "two" });
  });

  test("fetchJSON - should POST a JSON object from fake API", async () => {
    fetchMock.mockImplementation(
      (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        expect(req.method).toBe("POST");
        expect(req.body).toStrictEqual({
          three: "four",
        });
        return defaultRequestResolver(req, res, ctx);
      }
    );

    const response = await fetchJSON("https://fake.com", {
      body: {
        three: "four",
      },
    });

    expect(response).toBeDefined();
    expect(response.parsedBody).toStrictEqual({ one: "two" });
  });

  test("fetchJSON - should PATCH a JSON object from fake API", async () => {
    fetchMock.mockImplementation(
      (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        expect(req.method).toBe("PATCH");
        expect(req.body).toStrictEqual({
          three: "four",
        });
        return defaultRequestResolver(req, res, ctx);
      }
    );

    const response = await fetchJSON("https://fake.com", {
      body: {
        three: "four",
      },
      method: "PATCH",
    });

    expect(response).toBeDefined();
    expect(response.parsedBody).toStrictEqual({ one: "two" });
  });

  test("fetchJSON - should end with an error if timeout is reached", async () => {
    expect.assertions(1);
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        vi.advanceTimersByTime(1000);
        return res(ctx.status(200));
      }
    );

    await expect(fetchJSON("https://fake.com", {}, 1000)).rejects.toThrow(
      new Error(ERRORS.TAKE_TOO_LONG)
    );

    vi.useRealTimers();
  });

  test("fetchJSON - should reject if fetch operation was not successful due to authentication", async () => {
    fetchMock.mockImplementation(
      (_req: RestRequest, res: ResponseComposition, ctx: RestContext) =>
        res(ctx.status(401), ctx.json(""))
    );

    await expect(fetchJSON("https://fake.com")).rejects.toThrow(
      expect.objectContaining({ status: 401 })
    );
  });

  test("fetchJSON - should reject with error if fetch operation was not successful", async () => {
    fetchMock.mockImplementation(
      (_req: RestRequest, res: ResponseComposition, ctx: RestContext) =>
        res(ctx.status(400), ctx.json("Error"))
    );
    await expect(fetchJSON("https://fake.com")).rejects.toThrow(
      expect.objectContaining({ status: 400 })
    );
  });

  test("fetchJSON - should resolve return a simple text", async () => {
    fetchMock.mockImplementation(
      (_req: RestRequest, res: ResponseComposition, ctx: RestContext) =>
        res(
          ctx.set("Content-Type", "text/xml"),
          ctx.text("<Message></Message>")
        )
    );

    const response = await fetchJSON("https://fake.com");

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.parsedBody).toBe("<Message></Message>");
  });

  test("fetchJSON - should encode query parameters correctly if passed", async () => {
    const response = await fetchJSON("https://fake.com/foo", {
      queryParams: {
        email: "hsimpson+existinguser@gmail.com",
        text: "Hello Günter",
        selection: ["first", "the second"],
      },
    });

    expect(response).toBeDefined();

    expect(response.url).toBe(
      "https://fake.com/foo?email=hsimpson%2Bexistinguser%40gmail.com&text=Hello%20G%C3%BCnter&selection=first&selection=the%20second"
    );

    const queryParams = new URL(response.url).searchParams;
    expect(queryParams.get("email")).toBe("hsimpson+existinguser@gmail.com");
    expect(queryParams.get("text")).toBe("Hello Günter");
    expect(queryParams.getAll("selection")).toEqual(["first", "the second"]);
  });
});
