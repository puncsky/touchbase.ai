/* tslint:disable:no-non-null-assertion */
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { combineReducers, Reducer } from "redux";
import { MyServer } from "../../server/start-server";
import { MyContext } from "../../types/global";
import { AppContainer } from "../app-container";
import { apolloSSR } from "../common/apollo-ssr";
import { humansReducer } from "../contacts/humans-reducer";
import { humanReducer, interactionsReducer } from "./human-reducer";
import { EMPTY_HUMAN } from "./profile-creator";

// tslint:disable-next-line:max-func-body-length
export function setHumanHandlers(server: MyServer): void {
  // @ts-ignore
  server.get("/onboard/", server.auth.authRequired, async (ctx: MyContext) => {
    // @ts-ignore
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: <AppContainer />,
      reducer: combineReducers<Reducer>({
        base: noopReducer,
        human: humanReducer,
        humans: humansReducer,
        interactions: interactionsReducer,
        apolloState: noopReducer
      }),
      clientScript: "/main.js"
    });
  });

  server.get(
    "home",
    "/",
    server.auth.authOptionalContinue,
    async (ctx: MyContext, next) => {
      if (!ctx.state.userId) {
        next();
        return;
      }
      const user = await server.auth.user.getById(ctx.state.userId);
      let selfProfile = await server.model.human.getById(
        user!.id,
        user!.lifetimeHumanId
      );
      if (!selfProfile) {
        // TODO(tian): just create a default one for now. should lead to onboarding steps.
        selfProfile = await server.model.human.newAndSave({
          ...EMPTY_HUMAN,
          name: "your name",
          ownerId: ctx.state.userId
        });
        await server.auth.user.updateAssocProfileId(
          ctx.state.userId,
          selfProfile._id
        );
      }
      ctx.redirect(`/${selfProfile._id}/`);
    }
  );
  server.get(
    "contacts",
    "/contacts/:contact*",
    server.auth.authRequired,
    async (ctx: MyContext) => {
      ctx.setState("base.userId", ctx.state.userId);
      // @ts-ignore
      ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
        VDom: <AppContainer />,
        reducer: combineReducers<Reducer>({
          base: noopReducer,
          human: humanReducer,
          humans: humansReducer,
          interactions: interactionsReducer,
          apolloState: noopReducer
        }),
        clientScript: "/main.js"
      });
    }
  );
  server.get(
    "profile",
    // @ts-ignore
    /^(?!\/?api-gateway\/)\/.+\/$/,
    server.auth.authRequired,
    async (ctx: MyContext) => {
      const nameDot = ctx.path.split("/")[1].toLowerCase();
      const user = await server.auth.user.getById(ctx.state.userId);
      const name = nameDot.replace(/-/g, " ").replace(/\./g, " ");
      const human = await server.model.human.getByName(user!.id, name);
      ctx.setState("human", human);
      ctx.setState("base.ownerHumanId", user!.lifetimeHumanId);
      ctx.setState("base.userId", user!.id);
      ctx.setState("base.userDid", user!.did);
      // @ts-ignore
      ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
        VDom: <AppContainer />,
        reducer: combineReducers<Reducer>({
          base: noopReducer,
          human: humanReducer,
          humans: humansReducer,
          interactions: interactionsReducer,
          apolloState: noopReducer
        }),
        clientScript: "/main.js"
      });
    }
  );
}
