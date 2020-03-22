import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";

import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { getAdapter } from "./apollo-client-adapter";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

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
