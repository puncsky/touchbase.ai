import isBrowser from "is-browser";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const state = isBrowser && JsonGlobal("state");
export const apolloState = isBrowser && state.apolloState;
export const apiGatewayUrl = isBrowser && state.base.apiGatewayUrl;
export const csrfToken = isBrowser && state.base.csrfToken;
export const webPushPublicKey = isBrowser && state.base.webPushPublicKey;
export const userId = isBrowser && state.base.userId;
