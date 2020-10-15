import { State, Context } from "onefx/lib/types";
import koa from "koa";

type ReduxState = {
  base: Record<string, unknown>;
};

type MyContext = koa.ParameterizedContext<State, Context | unknown>;
