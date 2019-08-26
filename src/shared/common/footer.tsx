// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Link } from "react-router-dom";
import { CommonMargin } from "./common-margin";
import { Flex } from "./flex";
import { colors } from "./styles/style-color";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 89;
export const LINE = "1px #EDEDED solid";

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

export function Footer(): JSX.Element {
  return (
    <Align>
      <Flex>{`Copyright © ${new Date().getFullYear()}`}</Flex>
      <Flex column={true} alignItems="flex-end">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://onefx.js.org/?utm_source=beancount-io"
        >
          <img
            alt="built with onefx"
            style={{ height: "20px" }}
            src={assetURL("/built-with-onefx.svg")}
          />
        </a>

        <Flex>
          <Link style={{ fontSize: "10px" }} to="/page/legal/privacy-policy/">
            {t("tos.privacy")}
          </Link>
          <CommonMargin />
          {/* tslint:disable-next-line:react-a11y-anchors */}
          <Link style={{ fontSize: "10px" }} to="/page/legal/terms-of-service/">
            {t("tos.tos")}
          </Link>
        </Flex>
      </Flex>
    </Align>
  );
}

const Align = styled("div", (_: React.CSSProperties) => ({
  ...contentPadding,
  borderTop: LINE,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "32px",
  paddingBottom: "32px",
  minHeight: `${FOOTER_HEIGHT}px`,
  color: colors.text01
}));
