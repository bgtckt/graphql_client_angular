import { gql } from "apollo-angular";

export const CREATE_POST = gql`
  mutation createPost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
      text
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id)
  }
`;
