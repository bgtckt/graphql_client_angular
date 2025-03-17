import { gql } from "apollo-angular";

export const USER_CREATED = gql`
  subscription userCreated {
    userCreated {
      name
    }
  }
`;
