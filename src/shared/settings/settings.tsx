import Button from "antd/lib/button/button";
import Tabs from "antd/lib/tabs";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import Helmet from "react-helmet";
import { RouteComponentProps, withRouter } from "react-router";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { ResetPasswordContainer } from "../onefx-auth-provider/email-password-identity-provider/view/reset-password";
import { DangerZone } from "./danger-zone";
import { connect } from "react-redux";

const RESET_PW = "/settings/self-reset-password";

type Props = RouteComponentProps & {
  userDid: string;
};

class SettingsInner extends Component<Props> {
  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public render(): JSX.Element {
    const title = t("settings.manage_account");
    return (
      <div style={{ backgroundColor: colors.white, minHeight: "100vh" }}>
        <PageHeader>
          <ContentPadding>
            <h1>{title}</h1>
            <Helmet>
              <title>{`${title} - ${t("meta.title")}`}</title>
            </Helmet>
          </ContentPadding>
        </PageHeader>

        <ContentPadding>
          <Tabs activeKey={RESET_PW} onTabClick={this.onTabChange} type="card">
            <Tabs.TabPane key={RESET_PW} tab={t("settings.security")}>
              <TitleMargin>
                <h2>{t("settings.sessions")}</h2>
              </TitleMargin>

              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/logout";
                }}
              >
                {t("settings.logout")}
              </Button>

              <TitleMargin>
                <h2>{t("auth/reset_password")}</h2>
              </TitleMargin>

              {!this.props.userDid && (
                <div style={{ maxWidth: "320px" }}>
                  <ResetPasswordContainer isEmbedded={true} />
                </div>
              )}

              <TitleMargin>
                <h2 style={{ color: colors.error }}>
                  {t("settings.dangerZone")}
                </h2>
              </TitleMargin>

              <Zone>
                <DangerZone />
              </Zone>
            </Tabs.TabPane>
          </Tabs>
        </ContentPadding>
      </div>
    );
  }
}

const Zone = styled("div", () => ({
  padding: "20px",
  border: "1px solid red",
  marginBottom: "20px"
}));

const PageHeader = styled("div", () => ({
  backgroundColor: colors.white,
  padding: "32px 0"
}));

const TitleMargin = styled("div", {
  margin: "48px 0 24px 0"
});

export const Settings = withRouter(
  connect((state: { base: { userDid: string } }) => {
    return {
      userDid: state.base.userDid
    };
  })(SettingsInner)
);
