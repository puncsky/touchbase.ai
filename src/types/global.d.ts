import { State, Context } from "onefx/lib/types";
import koa from "koa";

type ReduxState = {
  base: object;
};

type MyContext = koa.ParameterizedContext<State, Context | any>;
