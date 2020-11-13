import { useQuery, ApolloError } from "@apollo/client";
import {
  GetInteractionCounts,
  GetInteractionCountsVariables
} from "../data/__generated__/GetInteractionCounts";
import { getInteractions } from "../data/queries";

export const useGetInteractionCounts = (
  variables?: GetInteractionCountsVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetInteractionCounts;
} => {
  const { loading, error, data } = useQuery<
    GetInteractionCounts,
    GetInteractionCountsVariables
  >(getInteractions, {
    ssr: false,
    variables
  });
  return { loading, error, data };
};
