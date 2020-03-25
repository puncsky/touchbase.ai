import { t } from "onefx/lib/iso-i18n";
import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { ReactSEOMetaTags } from "react-seo-meta-tags";

type Props = {
  locale: string;
  origin: string;
};

class Seo extends React.Component<Props> {
  public render(): JSX.Element {
    const { locale, origin } = this.props;
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
          url: origin,
          logo: `${origin}/favicon.svg`
        }}
      />
    );
  }
}

export const SeoContainer = connect(
  (state: { base: { locale: string; origin: string } }): Props => {
    return {
      locale: state.base.locale,
      origin: state.base.origin
    };
  },
  {}
)(Seo);
