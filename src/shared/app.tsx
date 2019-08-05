import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { Footer, FOOTER_ABOVE } from "./common/footer";
import initGoogleAnalytics from "./common/google-analytics";
import { Head } from "./common/head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TopBar } from "./common/top-bar";
import { Home } from "./home/home";
import { HumanProfileContainer } from "./human/human-profile";
import { ProfileCreatorContainer } from "./human/profile-creator";
import { ProfileEditorContainer } from "./human/profile-editor/profile-editor";
import { HumansTableContainer } from "./humans/humans";
import { Onboard } from "./onboard";

type Props = {
  googleTid: string;
  locale: string;
};

export class App extends Component<Props> {
  public componentDidMount(): void {
    initGoogleAnalytics({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    return (
      <RootStyle>
        <Head />
        <TopBar />
        <div style={FOOTER_ABOVE}>
          <ScrollToTop>
            <Switch>
              <Route
                exact
                path="/contacts/*"
                component={HumansTableContainer}
              />
              <Route exact path="/" component={Home} />
              <Route exact path="/onboard/" component={Onboard} />
              <Route
                exact
                path="/profile/*"
                component={HumanProfileContainer}
              />
              <Route
                exact
                path="/:nameDash/*"
                component={HumanProfileContainer}
              />
              <Route component={NotFound} />
            </Switch>
          </ScrollToTop>
        </div>
        <Route exact path="*/edit/" component={ProfileEditorContainer} />
        <Route exact path="*/create/" component={ProfileCreatorContainer} />
        <Footer />
      </RootStyle>
    );
  }
}

const RootStyle = styled("div", () => ({
  ...fonts.body,
  backgroundColor: colors.black05,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));
