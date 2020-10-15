import config from "config";
import { Server } from "onefx";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { MyContext } from "../../types/global";

export function baseStateMiddleware(_: Server): Promise<void> {
  return async (ctx: MyContext, next: () => unknown) => {
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
