import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import withRateLimit from "../../graphql/helpers/withRateLimit";
const { schema } = require("../../graphql/schema");

const server = new ApolloServer({
  schema,
  introspection: true,
  cache: "bounded",
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

export default withRateLimit(startServerAndCreateNextHandler(server));
