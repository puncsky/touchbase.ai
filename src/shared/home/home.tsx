import Button from "antd/lib/button";
import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Icon from "antd/lib/icon";
import Layout from "antd/lib/layout";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { PureComponent } from "react";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";
import { media } from "../common/styles/style-media";
import { ContentPadding } from "../common/styles/style-padding";

// @ts-ignore
@withRouter
class HomeInner extends PureComponent<{ userId: string }> {
  public render(): JSX.Element {
    // @ts-ignore
    const { history } = this.props;
    return (
      <Layout>
        <Layout.Content style={{ backgroundColor: colors.nav01 }}>
          <ContentPadding>
            <Row style={{ margin: "80px 0" }}>
              <Col md={12} xs={24}>
                <HeroH1>{t("home.title")}</HeroH1>
                <HeroP>{t("home.desc")}</HeroP>
                {this.props.userId ? (
                  <Flex justifyContent="flex-start!important">
                    <Button type="primary" size="large" href="/login/">
                      {t("home.get_started_welcome_back")}

                      <div className="bw ns dw nt it">
                        <svg
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <title>Arrow right (filled)</title>
                          <path
                            d="M22.2 12l-6.5 9h-3.5l5.5-7.5H2v-3h15.7L12.2 3h3.5l6.5 9z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </Button>
                    <CommonMargin />
                    <Button
                      size="large"
                      target="_blank"
                      href="https://github.com/puncsky/guanxi-io"
                    >
                      Fork me on Github
                    </Button>
                  </Flex>
                ) : (
                  <Flex justifyContent="flex-start!important">
                    <Button type="primary" size="large" href="/sign-up/">
                      {t("home.get_started")}

                      <Icon type="arrow-right" />
                    </Button>
                    <CommonMargin />
                    <Button
                      size="large"
                      target="_blank"
                      href="https://github.com/puncsky/guanxi-io"
                    >
                      Fork me on Github
                    </Button>
                  </Flex>
                )}

                <CommonMargin />
              </Col>
              <Col md={12} xs={24}>
                <Flex center={true} width="100%">
                  <Img src={assetURL("/social-media.svg")} alt="social media" />
                </Flex>
              </Col>
            </Row>
          </ContentPadding>
        </Layout.Content>

        <Layout.Content>
          <ContentPadding>
            <Row style={{ margin: "80px 0" }}>
              <Col md={12} xs={24}>
                <Flex center={true} width="100%">
                  <Img
                    src={assetURL("/mission122.svg")}
                    alt="live a thriving social life"
                  />
                </Flex>
              </Col>

              <Col md={12} xs={24}>
                <H2>{t("home.section1.title")}</H2>
                <P
                  dangerouslySetInnerHTML={{ __html: t("home.section1.desc") }}
                />
              </Col>
            </Row>
          </ContentPadding>
        </Layout.Content>
      </Layout>
    );
  }
}

export const Home = connect((state: { base: { userId: string } }) => ({
  userId: state.base.userId
}))(HomeInner);

const Img = styled("img", {
  width: "100%",
  maxHeight: "400px",
  margin: "8px"
});

const HeroH1 = styled("h1", {
  fontSize: "36px",
  margin: 0,
  fontWeight: 500,
  [media.palm]: {
    fontSize: "24px"
  }
});

const HeroP = styled("p", {
  fontSize: "18px",
  margin: "36px 0",
  [media.palm]: {
    fontSize: "14px"
  }
});

const H2 = styled("h2", {
  fontSize: "34px",
  [media.palm]: {
    fontSize: "24px"
  }
});

const P = styled("div", {
  fontSize: "18px",
  [media.palm]: {
    fontSize: "14px"
  }
});
