import { useQuery, ApolloError } from "@apollo/client";
import {
  GetArticles,
  GetArticlesVariables
} from "@/shared/article/data/__generated__/GetArticles";
import { getArticles } from "@/shared/article/data/queries";

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
