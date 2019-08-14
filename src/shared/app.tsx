import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { ArticleFetcher } from "./article/article-fetcher";
import { Footer, FOOTER_ABOVE } from "./common/footer";
import initGoogleTagmanager from "./common/google-analytics";
import { Head } from "./common/head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TopBar } from "./common/top-bar";
import { ContactDetailContainer } from "./contact/contact-detail";
import { ProfileCreatorContainer } from "./contact/profile-creator";
import { ProfileEditorContainer } from "./contact/profile-editor/profile-editor";
import { ContactsTableContainer } from "./contacts/contacts-table";
import { Home } from "./home/home";
import { Onboard } from "./onboard";
import { Settings } from "./settings/settings";

type Props = {
  googleTid: string;
  locale: string;
};

export class App extends Component<Props> {
  public componentDidMount(): void {
    initGoogleTagmanager({ tid: this.props.googleTid });
  }

  public render(): JSX.Element {
    return (
      <RootStyle>
        <Head />
        <TopBar />
        <div style={FOOTER_ABOVE}>
          <ScrollToTop>
            <Switch>
              <Route exact path="/legal/:id" component={ArticleFetcher} />
              <Route
                exact
                path="/contacts/*"
                component={ContactsTableContainer}
              />
              <Route exact path="/" component={Home} />
              <Route exact path="/onboard/" component={Onboard} />
              <Route
                exact
                path="/profile/*"
                component={ContactDetailContainer}
              />
              <Route exact path="/settings/*" component={Settings} />
              <Route
                exact
                path="/:nameDash/*"
                component={ContactDetailContainer}
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
