import { gql } from 'apollo-server-micro';

export default gql`
  type Query {
    sayHello: String
  }
`;
