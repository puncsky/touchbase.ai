import gql from "graphql-tag";

export const deleteNote = gql`
  mutation DeleteContact($id: String!) {
    deleteContact(deleteContactInput: { _id: $id })
  }
`;
