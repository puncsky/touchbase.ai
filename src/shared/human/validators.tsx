import koa from "koa";

export async function humanValidator(
  ctx: koa.Context,
  next: Function
): Promise<void> {
  ctx.request.body = {
    ...ctx.request.body,
    name: ctx.request.body.name.toLowerCase()
  };
  await next();
}
