import { makeDIDFromAddress, publicKeyToAddress } from "blockstack";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import * as React from "react";
import { combineReducers } from "redux";
import validator from "validator";
import { MyServer } from "../../../server/start-server";
import { MyContext } from "../../../types/global";
import { verifyDidToken } from "../../common/did-token/verify-did-token";
import { IdentityAppContainer } from "./view/identity-app-container";

const PASSWORD_MIN_LENGTH = 6;

type Handler = MyContext;

export function emailValidator(): Handler {
  return async (ctx: MyContext, next: Function) => {
    let { email } = ctx.request.body;
    email = String(email).toLowerCase();
    email = validator.trim(email);
    if (!validator.isEmail(email)) {
      return (ctx.response.body = {
        ok: false,
        error: {
          code: "auth/invalid-email",
          message: ctx.t("auth/invalid-email")
        }
      });
    }

    ctx.request.body.email = email;
    return next(ctx);
  };
}

export function passwordValidator(): Handler {
  return async (ctx: MyContext, next: Function) => {
    let { password } = ctx.request.body;
    password = String(password);
    if (password.length < PASSWORD_MIN_LENGTH) {
      return (ctx.response.body = {
        ok: false,
        error: {
          code: "auth/weak-password",
          message: ctx.t("auth/weak-password")
        }
      });
    }

    ctx.request.body.password = password;
    return next(ctx);
  };
}

function isMobileWebView(ctx: MyContext): boolean {
  const isMobile =
    ctx.headers["x-app-id"] === "mobile-guanxi-io" ||
    ctx.session.isMobileWebView;
  if (isMobile) {
    ctx.session.isMobileWebView = true;
  }
  return isMobile;
}

// tslint:disable-next-line
export function setEmailPasswordIdentityProviderRoutes(server: MyServer): void {
  // view routes
  server.get(
    "login",
    "/login",
    // server.auth.authOptionalContinue,
    async (ctx: MyContext, _: Function) => {
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.userId", ctx.state.userId);
      ctx.setState("base.isMobileWebView", isMobileWebView(ctx));
      return isoRender(ctx);
    }
  );
  server.get(
    "sign-up",
    "/sign-up",
    // server.auth.authOptionalContinue,
    async (ctx: MyContext, _: Function) => {
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.userId", ctx.state.userId);
      return isoRender(ctx);
    }
  );
  server.get(
    "forgot-password",
    "/forgot-password",
    // server.auth.authOptionalContinue,
    async (ctx: MyContext, _: Function) => {
      ctx.setState("base.next", ctx.query.next);
      ctx.setState("base.userId", ctx.state.userId);
      return isoRender(ctx);
    }
  );
  server.get("reset-password", "/reset-password/*", async (ctx: MyContext) => {
    const token = ctx.query.token;
    const found = await server.auth.emailToken.findOne(token);
    ctx.setState("base.token", found && found.token);
    return isoRender(ctx);
  });
  server.get("logout", "/logout", server.auth.logout);
  server.get(
    "email-token",
    "/email-token/:token",
    async (ctx: MyContext, next: Function) => {
      const et = await server.auth.emailToken.findOneAndDelete(
        ctx.params.token
      );
      if (!et || !et.userId) {
        return isoRender(ctx);
      }

      const newToken = await server.auth.emailToken.newAndSave(et.userId);
      ctx.query.next = `/reset-password/?token=${encodeURIComponent(
        newToken.token
      )}`;
      ctx.state.userId = et.userId;
      await next();
    },
    server.auth.postAuthentication
  );

  server.get("login-blockstack", "/login/blockstack-success", async ctx => {
    return isoRender(ctx);
  });

  // API routes
  server.post(
    "api-sign-up",
    "/api/sign-up/",
    emailValidator(),
    passwordValidator(),
    async (ctx: MyContext, next: Function) => {
      const { email, password } = ctx.request.body;
      try {
        const user = await server.auth.user.newAndSave({
          email,
          password,
          ip: ctx.headers["x-forward-for"]
        });
        ctx.state.userId = user && user.id;
        await next();
      } catch (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          ctx.body = {
            ok: false,
            error: {
              code: "auth/email-already-in-use",
              message: ctx.t("auth/email-already-in-use")
            }
          };
          return;
        }
      }
    },
    server.auth.postAuthentication
  );

  server.post(
    "api-sign-in",
    "/api/sign-in/",
    emailValidator(),
    async (ctx: MyContext, next: Function) => {
      const { email, password } = ctx.request.body;
      const user = await server.auth.user.getByMail(email);
      if (!user) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/user-not-found",
            message: ctx.t("auth/user-not-found")
          }
        };
        return;
      }
      const isPasswordVerified = await server.auth.user.verifyPassword(
        user.id,
        password
      );
      if (!isPasswordVerified) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/wrong-password",
            message: ctx.t("auth/wrong-password")
          }
        };
        return;
      }
      if (user.isBlocked) {
        ctx.response.body = {
          ok: false,
          error: {
            code: "auth/user-disabled",
            message: ctx.t("auth/user-disabled")
          }
        };
        return;
      }
      ctx.state.userId = user.id;
      await next();
    },
    server.auth.postAuthentication
  );

  server.post(
    "api-forgot-password",
    "/api/forgot-password/",
    emailValidator(),
    async (ctx: MyContext) => {
      const { email } = ctx.request.body;

      const user = await server.auth.user.getByMail(email);
      if (user) {
        await server.auth.sendResetPasswordLink(user.id, user.email, ctx.t);
      }

      return (ctx.response.body = {
        ok: true
      });
    }
  );

  server.post(
    "did-token-exchange",
    "/api/did-token-exchange",
    async (ctx, next) => {
      const { didToken } = ctx.request.body;
      let payload;
      try {
        payload = verifyDidToken(didToken);
      } catch (e) {
        logger.debug(`failed to verify did token: ${e}`);
        return;
      }
      const address = publicKeyToAddress(payload.iss);
      const did = makeDIDFromAddress(address);

      // sign in or sign up
      let user = await server.auth.user.getByDid(did);
      if (!user) {
        user = await server.auth.user.newAndSaveDidUser({
          did
        });
        if (!user) {
          return;
        }
      }

      ctx.state.userId = user.id;

      await next();
    },
    server.auth.postAuthentication
  );

  server.post(
    "reset-password",
    "/api/reset-password/",
    server.auth.authRequired,
    async (ctx: MyContext) => {
      const { token, password, newPassword } = ctx.request.body;
      if (token) {
        const verified = Boolean(await server.auth.emailToken.findOne(token));
        if (!verified) {
          return ctx.redirect(`${server.auth.config.emailTokenLink}invalid`);
        }
      } else {
        const verified = await server.auth.user.verifyPassword(
          ctx.state.userId,
          password
        );
        if (!verified) {
          return (ctx.response.body = {
            ok: false,
            error: {
              code: "auth/wrong-password",
              message: ctx.t("auth/wrong-password")
            }
          });
        }
      }

      if (newPassword.length < PASSWORD_MIN_LENGTH) {
        return (ctx.response.body = {
          ok: false,
          error: {
            code: "auth/weak-password",
            message: ctx.t("auth/weak-password")
          }
        });
      }

      await server.auth.user.updatePassword(ctx.state.userId, newPassword);
      if (token) {
        // forgot password
        ctx.response.body = { ok: true, shouldRedirect: true, next: "/" };
      } else {
        // reset password
        ctx.response.body = { ok: true };
      }
      await server.auth.emailToken.findOneAndDelete(token);
    }
  );
}

function isoRender(ctx: MyContext): void {
  ctx.body = ctx.isoReactRender({
    VDom: <IdentityAppContainer />,
    reducer: combineReducers({
      base: noopReducer
    }),
    clientScript: "/identity-provider-main.js"
  });
}
