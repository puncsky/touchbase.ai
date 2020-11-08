import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { CommonMargin } from "../common/common-margin";
import { NotFound } from "../common/not-found";
import { Preloader } from "../common/preloader";
import { Article } from "./article";
import { useGetArticles } from "./hooks/useGetArticles";

export function ArticleFetcherInner(
  props: RouteComponentProps<{ id: string }>
): JSX.Element {
  const { loading, error, data } = useGetArticles({
    id: props.match.params.id
  });
  if (loading) {
    return <Preloader />;
  }
  if (error || !data || !data.articles) {
    return <NotFound />;
  }
  return (
    <>
      <CommonMargin />
      {/*
      // @ts-ignore */}
      <Article
        title={data.articles[0].title}
        contentHTML={data.articles[0].contentHTML}
      />
    </>
  );
}

export const ArticleFetcher = withRouter(ArticleFetcherInner);
