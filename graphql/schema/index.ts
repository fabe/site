import { buildSchema, type GraphQLFieldResolver } from "graphql";
import { resolvers } from "../resolvers";
import { typeDefsString } from "../typeDefs";

const baseSchema = buildSchema(typeDefsString);

// Attach query resolvers directly to schema fields,
// bypassing @graphql-tools/schema's mapSchema/rewireTypes
// which breaks in the nitro bundle due to dual graphql instances.
const queryType = baseSchema.getQueryType();
if (queryType) {
  const fields = queryType.getFields();
  for (const [fieldName, resolver] of Object.entries(
    resolvers.Query as Record<string, GraphQLFieldResolver<unknown, unknown>>,
  )) {
    if (fields[fieldName]) {
      fields[fieldName].resolve = resolver;
    }
  }
}

// Attach custom scalar serializers
const typeMap = baseSchema.getTypeMap();
for (const [name, scalar] of Object.entries(resolvers)) {
  if (name === "Query") continue;
  const type = typeMap[name];
  if (type && "serialize" in scalar) {
    Object.assign(type, {
      serialize: scalar.serialize,
      parseValue: scalar.parseValue,
      parseLiteral: scalar.parseLiteral,
    });
  }
}

export const schema = baseSchema;
