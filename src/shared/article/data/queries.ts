import gql from "graphql-tag";

export const getArticles = gql`
  query articles($id: String!) {
    articles(id: $id) {
      title
      contentHTML
    }
  }
`;
