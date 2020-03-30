import { t } from "onefx/lib/iso-i18n";
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
    ctx.body = await apolloSSR(ctx, "", {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js"
    });
  });

  server.post(
    "update-web-push-token",
    "/api/web-push-token",
    server.auth.authRequired,
    async ctx => {
      await server.model.pushToken.upsert({
        ownerId: ctx.state.userId,
        web: JSON.stringify(ctx.request.body)
      });
      ctx.response.body = "OK";
    }
  );

  server.get("manifest", "/manifest.json", async ctx => {
    ctx.set("content-type", "application/json");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.response.body = {
      name: t("meta.title"),
      start_url: ctx.origin,
      description: t("meta.description"),
      icons: [
        {
          src: `${ctx.origin}/favicon.png`,
          sizes: "400x400",
          type: "image/png"
        }
      ]
    };
  });

  setEmailPasswordIdentityProviderRoutes(server);
  setHumanHandlers(server);

  setApiGateway(server);

  server.get("SPA", /^(?!\/?api-gateway\/).+$/, async (ctx: MyContext) => {
    ctx.body = await apolloSSR(ctx, "", {
      VDom: <AppContainer />,
      reducer: noopReducer,
      clientScript: "/main.js"
    });
  });
}
