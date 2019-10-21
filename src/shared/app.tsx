import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Switch } from "react-router";
import { Route } from "react-router-dom";
import { ArticleFetcher } from "./article/article-fetcher";
import { Footer, FOOTER_ABOVE } from "./common/footer";
// @ts-ignore
import initGoogleTagmanager from "./common/google-analytics";
import { Head } from "./common/head";
import { NotFound } from "./common/not-found";
import { ScrollToTop } from "./common/scroll-top";
import { colors } from "./common/styles/style-color";
import { fonts } from "./common/styles/style-font";
import { TopBar } from "./common/top-bar";
import { ContactDetailContainer } from "./contact/contact-detail";
import { ProfileCreatorContainer } from "./contact/profile-creator";
import { ContactsTableContainer } from "./contacts/contacts-table";
import { Daily } from "./daily/daily";
import { Home } from "./home/home";
import { NoteFetcher } from "./note/note-fetcher";
import { Onboard } from "./onboard";
import { Settings } from "./settings/settings";

type Props = {
  googleTid: string;
  locale: string;
};

type State = {
  isScript: boolean;
};

export class App extends Component<Props, State> {
  public state: State = {
    isScript: false
  };

  public componentDidMount(): void {
    initGoogleTagmanager({ tid: this.props.googleTid });
    this.setState({ isScript: true });
  }

  public render(): JSX.Element {
    const { isScript } = this.state;
    return (
      <React.Fragment>
        {!isScript ? (
          <noscript>You need to enable JavaScript to run this app.</noscript>
        ) : (
          <RootStyle>
            <Head />
            <TopBar />
            <div style={FOOTER_ABOVE}>
              <ScrollToTop>
                <Switch>
                  <Route exact path="/ribao" component={Daily} />
                  <Route exact path="/page/:id+" component={ArticleFetcher} />
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
                    path="/me/*"
                    component={() => <ContactDetailContainer isSelf={true} />}
                  />
                  <Route exact path="/note/:id" component={NoteFetcher} />
                  <Route
                    exact
                    path="/:nameDash/*"
                    component={ContactDetailContainer}
                  />
                  <Route component={NotFound} />
                </Switch>
              </ScrollToTop>
            </div>
            <Route exact path="*/create/" component={ProfileCreatorContainer} />
            <Footer />
          </RootStyle>
        )}
      </React.Fragment>
    );
  }
}

const RootStyle = styled("div", () => ({
  ...fonts.body,
  backgroundColor: colors.black05,
  color: colors.text01,
  textRendering: "optimizeLegibility"
}));
