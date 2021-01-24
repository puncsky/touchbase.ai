import { connect } from "react-redux";
import { withRouter } from "react-router";

import { App } from "./app";

type Props = {
  googleTid: string;
  locale: string;
};

export const AppContainer = withRouter(
  // @ts-ignore
  connect<Props>(
    // @ts-ignore
    (state: Record<string, unknown>): Props => {
      return {
        // @ts-ignore
        googleTid: state.base.analytics.googleTid,
        // @ts-ignore
        locale: state.base.locale
      };
    }
  )(App)
);
