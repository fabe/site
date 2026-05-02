import { gql } from "@apollo/client";
import typeDefsString from "./schema.graphql?raw";

export { typeDefsString };

export const typeDefs = gql`${typeDefsString}`;
