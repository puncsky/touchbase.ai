import { useQuery, ApolloError } from "@apollo/client";
import {
  GetInteractions,
  GetInteractionsVariables
} from "@/shared/contact/data/__generated__/GetInteractions";
import { getInteractions } from "@/shared/contact/data/queries";

export const useGetInteractions = (
  variables?: GetInteractionsVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetInteractions;
  fetchMore: any;
} => {
  const { loading, error, data, fetchMore } = useQuery<
    GetInteractions,
    GetInteractionsVariables
  >(getInteractions, {
    ssr: false,
    variables
  });
  return { loading, error, data, fetchMore };
};
