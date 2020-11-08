import gql from "graphql-tag";

export const getArticles = gql`
  query GetArticles($id: String!) {
    articles(id: $id) {
      title
      contentHTML
    }
  }
`;
