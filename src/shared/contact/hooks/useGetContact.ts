import { useQuery, ApolloError } from "@apollo/client";
import {
  GetContact,
  GetContactVariables
} from "../data/__generated__/GetContact";
import { getContact } from "../data/queries";

export const useGetContact = (
  variables?: GetContactVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetContact;
} => {
  const { loading, error, data } = useQuery<GetContact, GetContactVariables>(
    getContact,
    {
      ssr: false,
      variables
    }
  );
  return { loading, error, data };
};
