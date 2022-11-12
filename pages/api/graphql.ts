import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-micro";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import withRateLimit from "../../graphql/helpers/withRateLimit";

const { schema } = require("../../graphql/schema");

function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "OPTIONS"],
  })
);

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  cache: "bounded",
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});
const startServer = apolloServer.start();

export default async function gqlHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await cors(req, res);

  const handler = await apolloServer.createHandler({ path: "/api/graphql" });
  return withRateLimit(handler)(req, res);
}
