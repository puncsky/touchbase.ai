import gql from "graphql-tag";

export const getNote = gql`
  query GetNote($id: String!) {
    note(id: $id) {
      timestamp
      content
    }
  }
`;
