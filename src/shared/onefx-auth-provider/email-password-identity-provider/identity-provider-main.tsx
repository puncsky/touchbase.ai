// @ts-ignore
import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
// @ts-ignore
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { combineReducers } from "redux";
import { IdentityAppContainer } from "./view/identity-app-container";

clientReactRender({
  VDom: <IdentityAppContainer />,
  reducer: combineReducers({
    base: noopReducer
  })
});
