import { ApolloError, useQuery } from "@apollo/client";
import { contact, contactVariables } from "../data/__generated__/contact";

import { getContact } from "../data/queries";

export const useGetContact = (
  variables?: contactVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: contact;
} => {
  const { loading, error, data } = useQuery<contact, contactVariables>(
    getContact,
    {
      ssr: false,
      variables
    }
  );
  return { loading, error, data };
};
