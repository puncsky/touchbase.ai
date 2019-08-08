import koa = require("koa");
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { combineReducers } from "redux";
import { MyServer } from "../../server/start-server";
import { TPersonalNote } from "../../types/contact";
import { AppContainer } from "../app-container";
import { mdit } from "../common/markdownit";
import { humansReducer } from "../humans/humans-reducer";
import { humanReducer, interactionsReducer } from "./human-reducer";
import { EMPTY_HUMAN } from "./profile-creator";
import { humanValidator } from "./validators";

// tslint:disable-next-line:max-func-body-length
export function setHumanHandlers(server: MyServer): void {
  server.get("/onboard/", server.auth.authRequired, async ctx => {
    ctx.body = ctx.isoReactRender({
      VDom: <AppContainer />,
      clientScript: "/main.js",
      reducer: combineReducers({
        base: noopReducer,
        human: humanReducer,
        interactions: interactionsReducer
      })
    });
  });

  server.get(
    "home",
    "/",
    server.auth.authOptionalContinue,
    async (ctx, next) => {
      if (!ctx.state.userId) {
        return next();
      }
      const user = await server.auth.user.getById(ctx.state.userId);
      let selfProfile = await server.model.human.getById(
        user.id,
        user.lifetimeHumanId
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
      ctx.redirect(`${selfProfile.name.replace(/ /g, ".")}/`);
    }
  );
  server.get("contacts", "/contacts/*", server.auth.authRequired, async ctx => {
    const humans = await server.model.human.findById(ctx.state.userId, 0, 1000);
    ctx.setState("humans", humans);
    ctx.setState("base.userId", ctx.state.userId);
    ctx.body = ctx.isoReactRender({
      VDom: <AppContainer />,
      clientScript: "/main.js",
      reducer: combineReducers({
        base: noopReducer,
        human: humanReducer,
        interactions: interactionsReducer,
        humans: humansReducer
      })
    });
  });
  server.get(
    "profile",
    // @ts-ignore
    /^(?!\/?api-gateway\/)\/.+\/$/,
    server.auth.authRequired,
    async (ctx: koa.Context) => {
      const nameDot = ctx.path.split("/")[1].toLowerCase();
      const user = await server.auth.user.getById(ctx.state.userId);
      const name = nameDot.replace(/-/g, " ").replace(/\./g, " ");
      const human = await server.model.human.getByName(user.id, name);
      if (!human) {
        return;
      }
      ctx.setState("human", human);
      ctx.setState("base.ownerHumanId", user.lifetimeHumanId);
      ctx.setState("base.userId", user.id);
      const interactions =
        (await server.model.event.getAllByOwnerIdRelatedHumanId(
          ctx.state.userId,
          human.id
        )) || [];
      ctx.setState(
        "interactions",
        interactions.map((iter: TPersonalNote) => ({
          id: iter.id,
          timestamp: iter.timestamp,
          content: iter.content,
          contentHtml: mdit.render(iter.content)
        }))
      );
      ctx.body = ctx.isoReactRender({
        VDom: <AppContainer />,
        clientScript: "/main.js",
        reducer: combineReducers({
          base: noopReducer,
          human: humanReducer,
          interactions: interactionsReducer
        })
      });
    }
  );

  // APIs
  server.post(
    "createHuman",
    "/api/createHuman/",
    server.auth.authRequired,
    humanValidator,
    async ctx => {
      const newHuman = await server.model.human.newAndSave({
        ...ctx.request.body,
        ownerId: ctx.state.userId
      });
      ctx.response.body = { ok: true, result: newHuman };
    }
  );
  server.post(
    "updateHuman",
    "/api/updateHuman/",
    server.auth.authRequired,
    async ctx => {
      await server.model.human.updateOne(
        ctx.request.body._id,
        ctx.state.userId,
        ctx.request.body
      );
      ctx.response.body = { ok: true };
    }
  );
  server.post(
    "upsertEvent",
    "/api/upsertEvent/",
    server.auth.authRequired,
    async ctx => {
      const item = ctx.request.body;
      const ownerId = ctx.state.userId;
      const event = await upsertEvent(ownerId, item);
      ctx.response.body = {
        ok: true,
        result: {
          id: event.id,
          timestamp: event.timestamp,
          content: event.content,
          contentHtml: mdit.render(event.content)
        }
      };
    }
  );

  // services
  async function upsertEvent(
    ownerId: string,
    item: TPersonalNote
  ): Promise<TPersonalNote> {
    const found = item.content.match(/@([a-zA-Z\u4e00-\u9fa5.]+)/g) || [];
    const usernames = found.map(it => it.replace("@", "").replace(".", " "));
    const humans = await server.model.human.findManyIdsByNames(usernames);
    item.relatedContacts = [
      ...item.relatedContacts,
      ...humans.map((h: TPersonalNote) => h.id)
    ];
    const ownedItem = { ownerId, ...item };
    if (!item.id) {
      ownedItem.timestamp = new Date();
      return server.model.event.add(ownedItem);
    }
    return server.model.event.updateOne(item.id, ownerId, ownedItem);
  }
}
