import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { decryptECIES, encryptECIES } from "blockstack/lib/encryption";
import dottie from "dottie";
import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const state = isBrowser && JsonGlobal("state");
const apolloState = isBrowser && state.apolloState;
const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
const csrfToken = isBrowser && state.base.csrfToken;

const PIIs = [
  "name"
  // "avatarUrl",
  // "address",
  // "bornAt",
  // "bornAddress",
  // "gender",
  // // "emails",
  // "linkedin",
  // "wechat",
  // "facebook",
  // "github",
  // // "phones",
];

const requestOps = ["updateContact"];

const responseOpts = ["contact"];

const requestFields = {
  updateContact: "updateContactInput"
};

const privateKey =
  "a5c61c6ca7b3e7e55edee68566aeab22e4da26baa285c7bd10e8d2218aa3b229";
const publicKey =
  "027d28f9951ce46538951e3697c62588a87f1f1f295de4a14fdd4c780fc52cfe69";

const middlewareLink = new ApolloLink((operation, forward) => {
  if (requestOps.indexOf(operation.operationName) !== -1) {
    for (const pii of PIIs) {
      const piiVal =
        dottie.get(
          operation,
          `variables.${
            // @ts-ignore
            requestFields[operation.operationName]
          }.${pii}`
        ) || "";
      if (piiVal) {
        const cipherObj = encryptECIES(publicKey, String(piiVal));
        dottie.set(
          operation,
          `variables.${
            // @ts-ignore
            requestFields[operation.operationName]
          }.${pii}`,
          JSON.stringify(cipherObj)
        );
      }
    }
  }
  return forward(operation).map(response => {
    if (responseOpts.indexOf(operation.operationName) !== -1 && response.data) {
      for (const pii of PIIs) {
        const piiVal =
          dottie.get(response, `data.${operation.operationName}.${pii}`) || "";
        if (piiVal) {
          let piiDec = piiVal;
          try {
            const val = JSON.parse(String(piiVal));
            piiDec = decryptECIES(privateKey, val);
            // tslint:disable-next-line:no-empty
          } catch (e) {
          } finally {
            dottie.set(
              response,
              `data.${operation.operationName}.${pii}`,
              piiDec
            );
          }
        }
      }
    }
    return response;
  });
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
