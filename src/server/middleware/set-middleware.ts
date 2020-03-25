import { Server } from "onefx/lib/server";
import { baseStateMiddleware } from "./base-state-middleware";
import { multiDomainMiddleware } from "./multi-domain-middleware";

export function setMiddleware(server: Server): void {
  server.use(multiDomainMiddleware(server));
  server.use(baseStateMiddleware(server));
}
