import fetch from "node-fetch";
import { Args, ArgsType, Field, ObjectType, Query } from "type-graphql";

const SourceUrl = "https://tianpan.co/cms/system-design-and-architecture/?";

@ObjectType()
class PlayBook {
  @Field(_ => String)
  public layout: string;
  @Field(_ => String)
  public title: string;
  @Field(_ => String)
  public categories: string;
  @Field(_ => String)
  public language: string;
  @Field(_ => [String])
  public references: Array<string>;
  @Field(_ => String, { nullable: true })
  public meta: string;
}

@ArgsType()
class Pagination {
  @Field(_ => Number)
  public skip: number;
  @Field(_ => Number)
  public limit: number;
}

export class PlaybookResolver {
  @Query(_ => [PlayBook])
  public async playbookQuery(
    @Args() { skip, limit }: Pagination
  ): Promise<Array<PlayBook>> {
    const result = await fetch(`${SourceUrl}skip=${skip}&limit=${limit}`);
    const json = await result.json();
    return json.map((item: PlayBook & { contentHTML: string }) => {
      item.meta = item.contentHTML;
      delete item.contentHTML;
      return item;
    });
  }
}
