import React from "react";
import Helmet from "react-helmet";
// @ts-ignore
import { ReactSEOMetaTags } from "react-seo-meta-tags";

class Seo extends React.Component {
  public render(): JSX.Element {
    return (
      <ReactSEOMetaTags
        render={(el: React.ReactNode) => <Helmet>{el}</Helmet>}
        website={{
          title: "title",
          language: "zh-cn"
        }}
        organization={{
          name: "Google",
          legalName: "Google Inc",
          url: "https://google.com",
          logo: "https://google.com/logo.jpg"
        }}
      />
    );
  }
}

export default Seo;
