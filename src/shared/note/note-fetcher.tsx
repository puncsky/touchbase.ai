import React from "react";
import { useParams } from "react-router-dom";
import { Article } from "../article/article";
import { CommonMargin } from "../common/common-margin";
import { mdit } from "../common/markdownit";
import { NotFound } from "../common/not-found";
import { useGetNote } from "./hooks/useGetNote";

export function NoteFetcher(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useGetNote({ id });
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
}
