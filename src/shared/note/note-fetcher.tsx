import gql from "graphql-tag";
import React from "react";
import { Query } from "@apollo/client/react/components";
import { QueryResult } from "@apollo/client/react/types/types";
import { RouteComponentProps, withRouter } from "react-router";
import { TPersonalNote } from "../../types/contact";
import { Article } from "../article/article";
import { CommonMargin } from "../common/common-margin";
import { mdit } from "../common/markdownit";
import { NotFound } from "../common/not-found";

const FETCH_NOTE = gql`
  query note($id: String!) {
    note(id: $id) {
      timestamp
      content
    }
  }
`;

export function NoteFetcherInner(
  props: RouteComponentProps<{ id: string }>
): JSX.Element {
  return (
    <Query query={FETCH_NOTE} variables={{ id: props.match.params.id }}>
      {({ loading, error, data }: QueryResult<{ note: TPersonalNote }>) => {
        if (loading || error || !data || !data.note) {
          return <NotFound />;
        }

        return (
          <>
            <CommonMargin />
            {/*
            // @ts-ignore */}
            <Article
              title="Shared Note"
              contentHTML={mdit.render(data.note.content)}
            />
          </>
        );
      }}
    </Query>
  );
}

export const NoteFetcher = withRouter(NoteFetcherInner);
