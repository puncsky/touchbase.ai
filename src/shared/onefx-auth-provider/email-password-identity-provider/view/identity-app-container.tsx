import { connect } from "react-redux";
import { withRouter } from "react-router";
import { IdentityApp } from "./identity-app";

type ReduxState = {
  base: {
    analytics: {
      googleTid: string;
    };
    locale: string;
    isMobileWebView: boolean;
  };
};

export const IdentityAppContainer = withRouter(
  // @ts-ignore
  connect((state: ReduxState) => {
    return {
      googleTid: state.base.analytics.googleTid,
      locale: state.base.locale,
      isMobileWebView: state.base.isMobileWebView
    };
  })(IdentityApp)
);
