import { useQuery, ApolloError } from "@apollo/client";
import {
  GetContacts,
  GetContactsVariables
} from "../data/__generated__/GetContacts";
import { getContacts } from "../data/queries";

export const useGetContacts = (
  variables?: GetContactsVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetContacts;
} => {
  const { loading, error, data } = useQuery<GetContacts, GetContactsVariables>(
    getContacts,
    {
      ssr: false,
      variables
    }
  );
  return { loading, error, data };
};
