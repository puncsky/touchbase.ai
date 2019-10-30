import React from "react";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { ReactSEOMetaTags } from "react-seo-meta-tags";

class Seo extends React.Component {
  public render(): JSX.Element {
    return (
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{
          title: `${t("topbar.brand")}`,
          language: "zh-CN"
        }}
        organization={{
          name: t("topbar.brand"),
          legalName: t("topbar.brand"),
          url: "https://www.guanxilab.com/",
          logo: "https://www.guanxilab.com/favicon.svg"
        }}
      />
    );
  }
}

type Props = {
  locale: string;
};

export default connect<Props>(
  (state: {}): Props => {
    return {
      // @ts-ignore
      locale: state.base.locale
    };
  },
  {}
)(Seo);
