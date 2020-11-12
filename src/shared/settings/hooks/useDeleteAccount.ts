import { useMutation, MutationTuple } from "@apollo/client";
import {
  DeleteAccount,
  DeleteAccountVariables
} from "../data/__generated__/DeleteAccount";
import { deleteAccount } from "../data/mutations";

export const useDeleteAccount = (): MutationTuple<
  DeleteAccount,
  DeleteAccountVariables
> => {
  return useMutation<DeleteAccount, DeleteAccountVariables>(deleteAccount);
};
