<<<<<<< HEAD
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { ReactSEOMetaTags } from "react-seo-meta-tags";

type Props = {
  locale: string;
};

class Seo extends React.Component<Props> {
  public render(): JSX.Element {
    const { locale } = this.props;
=======
import React from "react";
import Helmet from "react-helmet";
// @ts-ignore
import { ReactSEOMetaTags } from "react-seo-meta-tags";

class Seo extends React.Component {
  public render(): JSX.Element {
>>>>>>> Update update seo
    return (
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{
<<<<<<< HEAD
          title: t("topbar.brand"),
          language: locale
        }}
        organization={{
          name: t("topbar.brand"),
          legalName: t("topbar.brand"),
          url: "https://www.guanxilab.com/",
          logo: "https://www.guanxilab.com/favicon.svg"
=======
          title: "title",
          language: "zh-cn"
        }}
        organization={{
          name: "Google",
          legalName: "Google Inc",
          url: "https://google.com",
          logo: "https://google.com/logo.jpg"
>>>>>>> Update update seo
        }}
      />
    );
  }
}

<<<<<<< HEAD
export const SeoContainer = connect<Props>(
  (state: {}): Props => {
    return {
      // @ts-ignore
      locale: state.base.locale
    };
  },
  {}
)(Seo);
=======
export default Seo;
>>>>>>> Update update seo
