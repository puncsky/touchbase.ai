import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { CommonMargin } from "../common/common-margin";
import { Article } from "./article";
import { ArticleResponse } from "./article-types";

const FETCH_ARTICLE = gql`
  query articles($id: String!) {
    articles(id: $id) {
      title
      contentHTML
    }
  }
`;

export function ArticleFetcherInner(
  props: RouteComponentProps<{ id: string }>
): JSX.Element {
  return (
    <Query query={FETCH_ARTICLE} variables={{ id: props.match.params.id }}>
      {({
        loading,
        error,
        data
      }: QueryResult<{ articles: Array<ArticleResponse> }>) => {
        if (loading || error || !data || !data.articles) {
          return null;
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
      }}
    </Query>
  );
}

export const ArticleFetcher = withRouter(ArticleFetcherInner);
