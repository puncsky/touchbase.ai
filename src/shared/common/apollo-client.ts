import { InMemoryCache } from "@apollo/client/cache";
import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client";

import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
import { getAdapter } from "./apollo-client-adapter";
import { apiGatewayUrl, apolloState, csrfToken } from "./browser-state";

const middlewareLink = new ApolloLink((operation, forward) => {
  const adapter = getAdapter(operation);
  return forward(adapter.forward(operation)).map(resp => adapter.map(resp));
});

const link = middlewareLink.concat(
  new HttpLink({
    uri: apiGatewayUrl,
    fetch,

    credentials: "same-origin",
    headers: { "x-csrf-token": csrfToken }
  })
);

export const apolloClient = new ApolloClient({
  ssrMode: !isBrowser,
  link,
  cache: new InMemoryCache().restore(apolloState)
});
