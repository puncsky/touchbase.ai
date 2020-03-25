import { Server } from "onefx";
import { MyContext } from "../../types/global";

export function multiDomainMiddleware(_: Server): Function {
  return async (ctx: MyContext, next: Function) => {
    if (
      ctx.origin.endsWith("guanxi.io") ||
      ctx.header["x-app-id"] === "guanxi-io"
    ) {
      if (!ctx.cookies.get("locale")) {
        ctx.request.query.locale = "zh-CN";
      }
    }
    await next();
  };
}
