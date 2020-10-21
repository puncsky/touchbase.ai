import { Server } from "onefx";
import { MyContext } from "../../types/global";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function multiDomainMiddleware(_: Server) {
  return async (ctx: MyContext, next: () => Promise<void>): Promise<void> => {
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
