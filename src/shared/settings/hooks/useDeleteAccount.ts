import { useMutation, MutationTuple } from "@apollo/client";
import {
  DeleteAccount,
  DeleteAccountVariables
} from "@/shared/settings/data/__generated__/DeleteAccount";
import { deleteAccount } from "@/shared/settings/data/mutations";

export const useDeleteAccount = (): MutationTuple<
  DeleteAccount,
  DeleteAccountVariables
> => {
  return useMutation<DeleteAccount, DeleteAccountVariables>(deleteAccount);
};
