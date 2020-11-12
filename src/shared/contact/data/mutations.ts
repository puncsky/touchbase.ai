import gql from "graphql-tag";

export const deleteNote = gql`
  mutation DeleteNote($id: String!) {
    deleteNote(deleteNoteInput: { _id: $id })
  }
`;
