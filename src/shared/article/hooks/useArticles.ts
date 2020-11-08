import { useQuery, ApolloError } from "@apollo/client";
import { articles } from "@/shared/article/data/__generated__/articles";
import { getArticles } from "@/shared/article/data/queries";

export const useArticles = (
  variables: { id: string } | null
): {
  loading: boolean;
  error: ApolloError | undefined;
  data: articles | undefined;
  refetch: any;
} => {
  const { loading, error, data, refetch } = useQuery<articles>(getArticles, {
    ssr: false,
    variables: variables || {}
  });
  return { loading, error, data, refetch };
};
