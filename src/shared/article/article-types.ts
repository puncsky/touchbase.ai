import { ArgsType, Field, ObjectType } from "type-graphql";
import { ArticleMeta } from "./load-dir";

@ArgsType()
export class ArticlesRequest {
  @Field(_ => String, { nullable: true })
  public id: string;
}

@ObjectType()
export class ArticleResponse implements ArticleMeta {
  @Field(_ => String)
  public contentHTML: string;
  @Field(_ => String)
  public id: string;
  @Field(_ => Boolean)
  public published: boolean;
  @Field(_ => String)
  public title: string;
  @Field(_ => String)
  public date: string;
  @Field(_ => [String])
  public references: Array<string>;
  @Field(_ => String)
  public abstract: string;
  @Field(_ => String)
  public language: string;
  @Field(_ => String)
  public filename: string;
}
