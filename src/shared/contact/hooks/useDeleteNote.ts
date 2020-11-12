import { useMutation, MutationTuple } from "@apollo/client";
import {
  DeleteNote,
  DeleteNoteVariables
} from "../data/__generated__/DeleteNote";
import { deleteNote } from "../data/mutations";

export const useDeleteNote = (): MutationTuple<
  DeleteNote,
  DeleteNoteVariables
> => {
  return useMutation<DeleteNote, DeleteNoteVariables>(deleteNote);
};
