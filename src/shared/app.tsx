import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import zhCN from "antd/lib/locale-provider/zh_CN";
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
import { setupSW } from "./common/subscribe-web-push";
import { TopBar } from "./common/top-bar";
import { ContactDetailContainer } from "./contact/contact-detail";
import { ProfileCreatorContainer } from "./contact/profile-creator";
import { ContactsTableContainer } from "./contacts/contacts-table";
import { Daily } from "./daily/daily";
import { DailyItem } from "./daily/daily-item";
import { Home } from "./home/home";
import { NoteFetcher } from "./note/note-fetcher";
import { Onboard } from "./onboard";
import { SeoContainer } from "./seo/seo";
import { Settings } from "./settings/settings";

type Props = {
  googleTid: string;
  locale: string;
};

export class App extends Component<Props> {
  public async componentDidMount(): Promise<void> {
    initGoogleTagmanager({ tid: this.props.googleTid });
    await setupSW();
  }

  public render(): JSX.Element {
    return (
      <RootStyle>
        <ConfigProvider locale={this.props.locale.includes("zh") ? zhCN : enUS}>
          <Head />
          <SeoContainer />
          <TopBar />
          <div style={FOOTER_ABOVE}>
            <ScrollToTop>
              <Switch>
                <Route exact path="/ribao" component={Daily} />
                <Route exact path="/ribao/:id" component={DailyItem} />
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
        </ConfigProvider>
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
