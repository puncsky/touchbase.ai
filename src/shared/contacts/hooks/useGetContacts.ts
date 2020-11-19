import { ApolloError, useQuery } from "@apollo/client";
import { contacts, contactsVariables } from "../data/__generated__/contacts";
import { getContacts } from "../data/queries";

export const useGetContacts = (
  variables?: contactsVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: contacts;
} => {
  const { loading, error, data } = useQuery<contacts, contactsVariables>(
    getContacts,
    {
      ssr: false,
      variables
    }
  );
  return { loading, error, data };
};
