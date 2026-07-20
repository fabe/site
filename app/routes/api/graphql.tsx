import { createFileRoute } from "@tanstack/react-router";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { schema } from "@/graphql/schema";

let serverInstance: ApolloServer | null = null;

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

const MUSIC_OPERATIONS = new Set([
  "MusicStatusQuery",
  "SpotifyStatusQuery",
  "LastfmStatusQuery",
]);

function extractOperationName(
  request: Request,
  searchParams: URLSearchParams,
  body?: Record<string, unknown>,
) {
  const explicitOperationName =
    typeof body?.operationName === "string"
      ? body.operationName
      : searchParams.get("operationName");

  if (explicitOperationName) return explicitOperationName;

  const query =
    typeof body?.query === "string" ? body.query : searchParams.get("query");

  return query?.match(/\b(?:query|mutation|subscription)\s+(\w+)/)?.[1];
}

function isLandingPageRequest(request: Request) {
  const url = new URL(request.url);

  return (
    request.method === "GET" &&
    !url.searchParams.has("query") &&
    request.headers.get("accept")?.includes("text/html")
  );
}

function getCacheControl(request: Request, operationName?: string) {
  if (request.method !== "GET" || isLandingPageRequest(request)) return "no-store";

  if (operationName && MUSIC_OPERATIONS.has(operationName)) {
    return "public, s-maxage=15, stale-while-revalidate=60";
  }

  return `public, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_WEEK}`;
}

function applyCacheHeaders(
  responseHeaders: Headers,
  request: Request,
  status: number,
  operationName?: string,
  hasErrors = false,
) {
  const cacheControl =
    status >= 200 && status < 300 && !hasErrors
      ? getCacheControl(request, operationName)
      : "no-store";

  responseHeaders.set("Cache-Control", cacheControl);
  responseHeaders.set("CDN-Cache-Control", cacheControl);
  responseHeaders.set("Vercel-CDN-Cache-Control", cacheControl);
}

async function getServer() {
  if (serverInstance) return serverInstance;

  serverInstance = new ApolloServer({
    schema,
    introspection: true,
    cache: "bounded",
    csrfPrevention: false,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await serverInstance.start();
  return serverInstance;
}

async function handleGraphQLRequest(request: Request): Promise<Response> {
  const server = await getServer();

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams);

  let body: Record<string, unknown> | undefined;
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = (await request.json()) as Record<string, unknown>;
    }
  }

  const operationName = extractOperationName(request, url.searchParams, body);

  const headers = new HeaderMap();
  for (const [key, value] of request.headers.entries()) {
    headers.set(key, value);
  }

  const result = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: request.method,
      headers,
      search: url.search,
      body: body ?? searchParams,
    },
    context: async () => ({}),
  });

  const responseHeaders = new Headers();
  for (const [key, value] of result.headers) {
    responseHeaders.set(key, value);
  }
  const status = result.status || 200;

  if (result.body.kind === "complete") {
    const body = JSON.parse(result.body.string) as { errors?: unknown[] };
    applyCacheHeaders(
      responseHeaders,
      request,
      status,
      operationName,
      Boolean(body.errors?.length),
    );

    return new Response(result.body.string, {
      status,
      headers: responseHeaders,
    });
  }

  // Streaming response
  applyCacheHeaders(responseHeaders, request, status, operationName);
  const asyncIter = result.body.asyncIterator;
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of asyncIter) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status,
    headers: responseHeaders,
  });
}

export const Route = createFileRoute("/api/graphql")({
  server: {
    handlers: {
      GET: async ({ request }) => handleGraphQLRequest(request),
      POST: async ({ request }) => handleGraphQLRequest(request),
    },
  },
});
