// @flow
import {
  ArticleMeta,
  loadDir,
  MdContentsByIds,
  PostsByIds,
  Snippet
} from "./load-dir";

type GetArticlesByRangeResponse = {
  snippets: Array<Snippet>;
  postsByIDs: PostsByIds;
  hasMore: boolean;
};

export class ArticleService {
  public snippets: Array<Snippet>;
  public postsByIds: PostsByIds;
  public mdContentsByIds: MdContentsByIds;

  constructor(dir: string) {
    const { snippets, postsByIDs, mdContentsByIds } = loadDir(dir);
    this.snippets = snippets;
    this.postsByIds = postsByIDs;
    this.mdContentsByIds = mdContentsByIds;
  }

  public getArticlesByRange(
    offset: number,
    limit: number,
    enOnly: boolean
  ): GetArticlesByRangeResponse {
    const ss = this.snippets
      .filter(s =>
        enOnly
          ? this.postsByIds[s.id].language === "en"
          : this.postsByIds[s.id].language !== "en"
      )
      .slice(offset, offset + limit);

    return {
      snippets: ss,
      postsByIDs: ss.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: this.postsByIds[cur.id]
        }),
        {}
      ),
      hasMore: offset + limit < this.snippets.length
    };
  }

  public getAll(): { snippets: Array<Snippet>; postsByIDs: PostsByIds } {
    return {
      snippets: this.snippets,
      postsByIDs: this.postsByIds
    };
  }

  public getPostById(id: string): ArticleMeta {
    return this.postsByIds[id];
  }

  public getTitleById(id: string): string {
    return this.postsByIds[id].title;
  }

  public getMdContentsById(id: string): string {
    return this.mdContentsByIds[id];
  }
}
