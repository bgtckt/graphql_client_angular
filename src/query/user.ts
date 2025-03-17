import { gql } from "apollo-angular";

export const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      email
      posts {
        id
        text
      }
    }
  }
`;
