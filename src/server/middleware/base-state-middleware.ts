import config from "config";
import koa from "koa";
import { Server } from "onefx";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { MyContext } from "../../types/global";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function baseStateMiddleware(_: Server) {
  return async (ctx: MyContext, next: koa.Next): Promise<void> => {
    let manifest = {};
    try {
      manifest = require("../../../dist/asset-manifest.json");
    } catch (e) {
      logger.info(`cannot load manifest: ${e.stack}`);
    }
    ctx.setState("base.manifest", manifest);
    ctx.setState("base.origin", ctx.origin);
    ctx.setState(
      "base.webPushPublicKey",
      config.get("gateways.webPush.publicKey")
    );
    await next();
  };
}
