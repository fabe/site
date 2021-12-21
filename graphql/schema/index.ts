import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from '../resolvers';
import { typeDefs } from '../typeDefs';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});
