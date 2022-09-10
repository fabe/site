import { makeExecutableSchema } from "@graphql-tools/schema";

import { resolvers } from "../resolvers";
import { typeDefs } from "../typeDefs";

module.exports = {
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
};
