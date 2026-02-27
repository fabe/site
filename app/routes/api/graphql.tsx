import { createFileRoute } from "@tanstack/react-router";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { schema } from "@/graphql/schema";

let serverInstance: ApolloServer | null = null;

async function getServer() {
  if (serverInstance) return serverInstance;

  serverInstance = new ApolloServer({
    schema,
    introspection: true,
    cache: "bounded",
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
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

  if (result.body.kind === "complete") {
    return new Response(result.body.string, {
      status: result.status || 200,
      headers: responseHeaders,
    });
  }

  // Streaming response
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
    status: result.status || 200,
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
