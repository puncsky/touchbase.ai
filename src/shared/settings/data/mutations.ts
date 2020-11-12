import gql from "graphql-tag";

export const deleteAccount = gql`
  mutation DeleteAccount($email: String!) {
    deleteAccount(deleteAccountInput: { email: $email })
  }
`;
