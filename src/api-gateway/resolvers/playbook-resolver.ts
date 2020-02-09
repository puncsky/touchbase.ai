import axios from "axios";
import { Args, ArgsType, Field, ObjectType, Query } from "type-graphql";

const SourceUrl = "https://tianpan.co/cms/system-design-and-architecture/?";

@ObjectType()
class PlayBook {
  @Field(() => String)
  id: string;
  @Field(() => String)
  url: string;
  @Field(() => Boolean)
  isFave: boolean;
  @Field(() => String)
  short: string;
  @Field(() => String)
  title: string;
  @Field(() => String)
  content: string;
  @Field(() => String)
  forwardedFor: string;
  @Field(() => Date)
  date: Date;
  @Field(() => Number)
  visitorCount: number;
  @Field(() => [Tag])
  tags: Array<Tag>;
  @Field(() => String)
  contentHTML: string;
  @Field(() => String)
  language: string;
}

@ObjectType()
class Tag {
  @Field(() => String)
  enum: string;
}

@ArgsType()
class Pagination {
  @Field(() => Number)
  skip: number;
  @Field(() => Number)
  limit: number;
}

export class PlaybookResolver {
  @Query(() => [PlayBook])
  async playbookArticles(
    @Args() { skip, limit }: Pagination
  ): Promise<Array<PlayBook>> {
    const { data } = await axios.get(`${SourceUrl}skip=${skip}&limit=${limit}`);
    return data.map((item: any) => {
      const tags = (item.tags || "").split(",");
      return {
        ...item,
        url: `https://guanxi.io/${item.id}`,
        tags: tags.map((t: string) => ({ enum: t })),
        isFave: false,
        short: item.abstract || "",
        forwardedFor: "https://guanxi.io/",
        date: new Date(item.date),
        visitorCount: 0
      };
    });
  }
}
