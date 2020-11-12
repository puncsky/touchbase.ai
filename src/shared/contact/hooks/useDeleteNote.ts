import { useMutation, MutationTuple } from "@apollo/client";
import {
  DeleteNote,
  DeleteNoteVariables
} from "@/shared/contact/data/__generated__/DeleteNote";
import { deleteNote } from "@/shared/contact/data/mutations";

export const useDeleteNote = (): MutationTuple<
  DeleteNote,
  DeleteNoteVariables
> => {
  return useMutation<DeleteNote, DeleteNoteVariables>(deleteNote);
};
