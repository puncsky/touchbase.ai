import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { combineReducers } from "redux";
import { AppContainer } from "../../shared/app-container";
import { apolloClient } from "../../shared/common/apollo-client";
import {
  humanReducer,
  interactionsReducer
} from "../../shared/human/human-reducer";
import { humansReducer } from "../../shared/humans/humans-reducer";

clientReactRender({
  VDom: (
    <ApolloProvider client={apolloClient}>
      <AppContainer />
    </ApolloProvider>
  ),
  reducer: combineReducers({
    base: noopReducer,
    human: humanReducer,
    humans: humansReducer,
    interactions: interactionsReducer,
    apolloState: noopReducer
  })
});
