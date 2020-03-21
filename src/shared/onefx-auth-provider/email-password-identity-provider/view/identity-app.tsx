import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Link, Route } from "react-router-dom";
import { Flex } from "../../../common/flex";
import { Footer, FOOTER_ABOVE } from "../../../common/footer";
// @ts-ignore
import initGoogleAnalytics from "../../../common/google-analytics";
import { Head } from "../../../common/head";
import { NotFound } from "../../../common/not-found";
import { colors } from "../../../common/styles/style-color";
import { fonts } from "../../../common/styles/style-font";
import { ContentPadding } from "../../../common/styles/style-padding";
import { TopBar } from "../../../common/top-bar";
import { BlockstackSuccess } from "./blockstack-success";
import { ForgotPassword } from "./forgot-password";
import { ResetPasswordContainer } from "./reset-password";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

type Props = {
  googleTid?: string;
  isMobileWebView?: boolean;
};

export class IdentityApp extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    const { isMobileWebView } = this.props;
    return (
      <RootStyle>
        <Head />
        {!isMobileWebView && <TopBar />}
        <div style={isMobileWebView ? { height: "100vh" } : FOOTER_ABOVE}>
          <Route path="/email-token/*" component={EmailTokenInvalid} />
          <Switch>
            <Route exact path="/login" component={SignIn} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/email-token/*" component={ForgotPassword} />
            <Route
              exact
              path="/login/blockstack-success"
              component={BlockstackSuccess}
            />
            <Route
              exact
              path="/reset-password/*"
              component={ResetPasswordContainer}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
        {!isMobileWebView && <Footer />}
      </RootStyle>
    );
  }
}

const RootStyle = styled("div", (_: React.CSSProperties) => ({
  ...fonts.body,
  backgroundColor: colors.black10,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));

function EmailTokenInvalid(): JSX.Element {
  return (
    <Alert>
      <ContentPadding>
        <Flex>
          {t("auth/forgot_password.email_token_failure")}
          <Link to="/forgot-password/">
            <i style={{ color: colors.white }} className="fas fa-times" />
          </Link>
        </Flex>
      </ContentPadding>
    </Alert>
  );
}

const Alert = styled("div", {
  padding: "16px 0 16px 0",
  backgroundColor: colors.error,
  color: colors.white
});
