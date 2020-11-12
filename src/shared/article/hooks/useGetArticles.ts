import { useQuery, ApolloError } from "@apollo/client";
import {
  GetArticles,
  GetArticlesVariables
} from "../data/__generated__/GetArticles";
import { getArticles } from "../data/queries";

export const useGetArticles = (
  variables?: GetArticlesVariables
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetArticles;
} => {
  const { loading, error, data } = useQuery<GetArticles, GetArticlesVariables>(
    getArticles,
    {
      ssr: false,
      variables
    }
  );
  return { loading, error, data };
};
