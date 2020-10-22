import gql from "graphql-tag";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Article } from "../article/article";
import { CommonMargin } from "../common/common-margin";
import { Preloader } from "../common/preloader";
import { ContentPadding } from "../common/styles/style-padding";

const query = gql`
  query gxArticle($id: String) {
    gxArticle(id: $id) {
      id
      url
      title
      content
      forwardedFor
      date
      visitorCount
      tags {
        enum
      }
    }
  }
`;

type GxArticle = {
  id: string;
  title: string;
  date: string;
  tags: Array<string>;
  forwardedFor: string;
  content: string;
  short: string;
};

export const DailyItem = withRouter<RouteComponentProps<{ id: string }>, any>(
  class DailyItemInner extends Component<RouteComponentProps<{ id: string }>> {
    public render(): JSX.Element {
      const { id } = this.props.match.params;
      return (
        <ContentPadding>
          <Query
            query={query}
            variables={{
              id
            }}
          >
            {({
              data,
              error,
              loading
            }: QueryResult<{ gxArticle: GxArticle }>) => {
              if (loading || error || !data) {
                return <Preloader />;
              }

              return (
                <>
                  <CommonMargin />
                  {/*
                //@ts-ignore */}
                  <Article
                    title={data.gxArticle.title}
                    contentHTML={data.gxArticle.content}
                    date={data.gxArticle.date}
                  />
                </>
              );
            }}
          </Query>
        </ContentPadding>
      );
    }
  }
);
