import { useQuery, ApolloError, ApolloQueryResult } from "@apollo/client";
import { GetNote } from "../data/__generated__/GetNote";
import { getNote } from "../data/queries";

export const useGetNote = (
  variables: { id: string } | null
): {
  loading: boolean;
  error?: ApolloError;
  data?: GetNote;
  refetch: (
    vars?: Partial<Record<string, any>>
  ) => Promise<ApolloQueryResult<GetNote>>;
} => {
  const { loading, error, data, refetch } = useQuery<GetNote>(getNote, {
    ssr: false,
    variables: variables || {}
  });
  return { loading, error, data, refetch };
};
