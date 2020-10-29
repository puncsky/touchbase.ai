import { State, Context } from "onefx/lib/types";

type ReduxState = {
  base: Record<string, unknown>;
};

type MyContext = ParameterizedContext<State, Context>;
