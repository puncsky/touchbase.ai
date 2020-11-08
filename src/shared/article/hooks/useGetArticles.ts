import { useQuery, ApolloError } from "@apollo/client";
import { GetArticles } from "@/shared/article/data/__generated__/GetArticles";
import { getArticles } from "@/shared/article/data/queries";

export const useGetArticles = (
  variables: { id: string } | null
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetArticles;
  refetch: any;
} => {
  const { loading, error, data, refetch } = useQuery<GetArticles>(getArticles, {
    ssr: false,
    variables: variables || {}
  });
  return { loading, error, data, refetch };
};
