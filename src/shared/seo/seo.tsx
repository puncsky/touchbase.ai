<<<<<<< HEAD
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { ReactSEOMetaTags } from "react-seo-meta-tags";

type Props = {
  locale: string;
};

class Seo extends React.Component {
  public render(): JSX.Element {
    return (
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{
          title: t("topbar.brand"),
          language: locale
        }}
        organization={{
          name: t("topbar.brand"),
          legalName: t("topbar.brand"),
          url: "https://www.guanxilab.com/",
          logo: "https://www.guanxilab.com/favicon.svg"
          title: `${t("topbar.brand")}`,
          language: "zh-CN"
        }}
      />
    );
  }
}

type Props = {
  locale: string;
};

export const SeoContainer = connect<Props>(
  (state: {}): Props => {
    return {
      // @ts-ignore
      locale: state.base.locale
    };
  },
  {}
)(Seo);
