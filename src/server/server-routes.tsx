import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import * as React from "react";
import { setApiGateway } from "../api-gateway/api-gateway";
import { AppContainer } from "../shared/app-container";
import { apolloSSR } from "../shared/common/apollo-ssr";
import { setHumanHandlers } from "../shared/contact/human-handler";
import { setEmailPasswordIdentityProviderRoutes } from "../shared/onefx-auth-provider/email-password-identity-provider/email-password-identity-provider-handler";
import { MyContext } from "../types/global";
import { MyServer } from "./start-server";

export function setServerRoutes(server: MyServer): void {
  // Health checks
  server.get("health", "/health", (ctx: MyContext) => {
    ctx.body = "OK";
  });

  server.get("legal", "/page/*", async (ctx: MyContext) => {
    // @ts-ignore
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js"
    });
  });

  setEmailPasswordIdentityProviderRoutes(server);
  setHumanHandlers(server);

  setApiGateway(server);

  // @ts-ignore
  server.get("SPA", /^(?!\/?api-gateway\/).+$/, async (ctx: MyContext) => {
    // @ts-ignore
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js"
    });
  });
}
