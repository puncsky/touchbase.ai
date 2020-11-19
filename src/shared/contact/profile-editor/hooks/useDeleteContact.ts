import { useMutation, MutationTuple } from "@apollo/client";
import {
  DeleteContact,
  DeleteContactVariables
} from "../data/__generated__/DeleteContact";
import { deleteNote } from "../data/mutations";

export const useDeleteContact = (): MutationTuple<
  DeleteContact,
  DeleteContactVariables
> => {
  return useMutation<DeleteContact, DeleteContactVariables>(deleteNote);
};
