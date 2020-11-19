import { useQuery, ApolloError } from "@apollo/client";
import {
  GetInteractionCounts,
  GetInteractionCountsVariables
} from "../data/__generated__/GetInteractionCounts";
import { getInteractionCounts } from "../data/queries";

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
  >(getInteractionCounts, {
    ssr: false,
    variables
  });
  return { loading, error, data };
};
