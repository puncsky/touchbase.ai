import Button from "antd/lib/button/button";
import Tabs from "antd/lib/tabs";
import Typography from "antd/lib/typography";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import Helmet from "react-helmet";
import { RouterProps, withRouter } from "react-router";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { ResetPasswordContainer } from "../onefx-auth-provider/email-password-identity-provider/view/reset-password";
import { DangerZone } from "./danger-zone";

const { Title } = Typography;

const RESET_PW = "/settings/self-reset-password";

type Props = RouterProps;

class SettingsInner extends Component<Props> {
  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public render(): JSX.Element {
    const title = t("settings.manage_your_account");
    return (
      <div style={{ backgroundColor: colors.white, minHeight: "100vh" }}>
        <PageHeader>
          <ContentPadding>
            <Title>{title}</Title>
            <Helmet>
              <title>{`${title} - ${t("")}`}</title>
            </Helmet>
          </ContentPadding>
        </PageHeader>

        <ContentPadding>
          <Tabs activeKey={RESET_PW} onTabClick={this.onTabChange} type="card">
            <Tabs.TabPane key={RESET_PW} tab={t("settings.security")}>
              <TitleMargin>
                <Title level={3}>{t("settings.sessions")}</Title>
              </TitleMargin>

              <Button href="/logout">{t("settings.logout")}</Button>

              <TitleMargin>
                <Title level={3}>{t("auth/reset_password")}</Title>
              </TitleMargin>
              <div style={{ maxWidth: "320px" }}>
                <ResetPasswordContainer isEmbedded={true} />
              </div>
              <TitleMargin>
                <Title level={3} type="danger">
                  {t("settings.dangerZone")}
                </Title>
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

// @ts-ignore
export const Settings = withRouter(SettingsInner);
