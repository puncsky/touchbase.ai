// @ts-ignore
import { SettingFilled } from "@ant-design/icons";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { styled, StyleObject } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CommonMargin } from "./common-margin";
import { Icon } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { SearchBox } from "./search-box";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";

export const TOP_BAR_HEIGHT = 50;

type State = {
  displayMobileMenu: boolean;
};

type Props = { loggedIn: boolean };

export const TopBar = connect((state: any) => ({
  loggedIn: Boolean(state.base.userId)
}))(
  class TopBarInner extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        displayMobileMenu: false
      };
    }

    public componentDidMount(): void {
      window.addEventListener("resize", () => {
        if (
          document.documentElement &&
          document.documentElement.clientWidth > PALM_WIDTH
        ) {
          this.setState({
            displayMobileMenu: false
          });
        }
      });
    }

    public displayMobileMenu = () => {
      this.setState({
        displayMobileMenu: true
      });
    };

    public hideMobileMenu = () => {
      this.setState({
        displayMobileMenu: false
      });
    };

    public renderMenu = () => {
      const { loggedIn } = this.props;
      if (!loggedIn) {
        return [
          <A key={0} href="/login" onClick={this.hideMobileMenu}>
            {t("topbar.login")}
          </A>
        ];
      }

      return (
        <>
          <StyledLink key={2} to="./create/" onClick={this.hideMobileMenu}>
            {t("topbar.create")}
          </StyledLink>
        </>
      );
    };

    public renderMobileMenu = () => {
      if (!this.state.displayMobileMenu) {
        return null;
      }

      if (!this.props.loggedIn) {
        return (
          <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
            <Dropdown>
              <A href="/login" onClick={this.hideMobileMenu}>
                {t("topbar.login")}
              </A>
              <A href="/sign-up" onClick={this.hideMobileMenu}>
                {t("topbar.sign_up")}
              </A>
            </Dropdown>
          </OutsideClickHandler>
        );
      }

      return (
        <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
          <Dropdown>
            <StyledLink key={2} to="./create/" onClick={this.hideMobileMenu}>
              {t("topbar.create")}
            </StyledLink>
            <StyledLink to="/contacts/" onClick={this.hideMobileMenu}>
              {t("topbar.contacts")}
            </StyledLink>
            <StyledLink to="/settings/" onClick={this.hideMobileMenu}>
              <SettingFilled />
            </StyledLink>
          </Dropdown>
        </OutsideClickHandler>
      );
    };

    public render(): JSX.Element {
      const { loggedIn } = this.props;
      const { displayMobileMenu } = this.state;

      return (
        <div>
          <Bar>
            <Flex>
              {loggedIn ? (
                <LinkLogoWrapper to="/me/">
                  <Icon
                    width={`${TOP_BAR_HEIGHT}px`}
                    url={assetURL("./favicon.svg")}
                  />
                </LinkLogoWrapper>
              ) : (
                <LogoWrapper href="/">
                  <Icon
                    width={`${TOP_BAR_HEIGHT}px`}
                    url={assetURL("./favicon.svg")}
                  />
                </LogoWrapper>
              )}
              <CommonMargin />
              <HiddenOnMobile>
                {!loggedIn && (
                  <BrandText href="/">{t("topbar.brand")}</BrandText>
                )}
              </HiddenOnMobile>

              {loggedIn && (
                <>
                  <SearchBox />
                  <HiddenOnMobile>
                    <BrandLink to="/contacts/" onClick={this.hideMobileMenu}>
                      {t("topbar.contacts")}
                    </BrandLink>
                    <BrandLink to="/settings/" onClick={this.hideMobileMenu}>
                      <SettingFilled />
                    </BrandLink>
                  </HiddenOnMobile>
                </>
              )}
            </Flex>
            <Flex>
              <Menu>{this.renderMenu()}</Menu>
            </Flex>
            <HamburgerBtn
              onClick={this.displayMobileMenu}
              displayMobileMenu={displayMobileMenu}
            >
              <Hamburger />
            </HamburgerBtn>
            <CrossBtn displayMobileMenu={displayMobileMenu}>
              <Cross />
            </CrossBtn>
          </Bar>
          <BarPlaceholder />
          {this.renderMobileMenu()}
        </div>
      );
    }
  }
);

const Bar = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: colors.nav01,
  position: "fixed",
  top: "0px",
  left: "0px",
  "z-index": "70",
  ...contentPadding,
  boxSizing: "border-box",
  boxShadow: "0 0 4px 0 #c6c6c6ba!important"
});

const BarPlaceholder = styled("div", (_: React.CSSProperties) => {
  const height = TOP_BAR_HEIGHT / 2;
  return {
    display: "block",
    padding: `${height}px ${height}px ${height}px ${height}px`,
    backgroundColor: colors.nav01
  };
});

function HamburgerBtn({
  displayMobileMenu,
  children,
  onClick
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
  onClick: (e: Event) => unknown;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.palm]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center"
  });
  return (
    <Styled
      // @ts-ignore
      onClick={onClick}
    >
      {children}
    </Styled>
  );
}

function CrossBtn({
  displayMobileMenu,
  children
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    display: "none!important",
    [media.palm]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center",
    padding: "5px"
  });
  return <Styled>{children}</Styled>;
}

const LogoWrapper = styled("a", {
  width: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`
});
const LinkLogoWrapper = styled(Link, {
  width: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`
});
const menuItem: StyleObject = {
  color: colors.text01,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: colors.primary
  },
  transition,
  fontWeight: "bold",
  [media.palm]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid"
  }
};
const A = styled("a", menuItem);
const BrandText = styled("a", {
  ...menuItem,
  marginLeft: 0,
  marginRight: "14px",
  [media.palm]: {}
});
const BrandLink = styled(Link, {
  ...menuItem,
  marginLeft: 0,
  marginRight: "14px",
  [media.palm]: {}
});
// @ts-ignore
const StyledLink = styled(Link, menuItem);

const Flex = styled("div", (_: React.CSSProperties) => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box"
}));

const Menu = styled("div", {
  display: "flex!important",
  [media.palm]: {
    display: "none!important"
  }
});

const Dropdown = styled("div", {
  backgroundColor: colors.nav01,
  display: "flex",
  flexDirection: "column",
  ...contentPadding,
  position: "fixed",
  top: TOP_BAR_HEIGHT,
  "z-index": "1",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box"
});

const HiddenOnMobile = styled("div", {
  display: "flex!important",
  [media.palm]: {
    display: "none!important"
  }
});
