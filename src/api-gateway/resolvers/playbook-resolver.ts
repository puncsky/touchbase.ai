import axios from "axios";
import { Args, ArgsType, Field, ObjectType, Query } from "type-graphql";

const SourceUrl = "http://localhost:4000/cms/guanxi-io-zh-cn/?";

@ObjectType()
class PlayBook {
  @Field(() => String)
  id: string;
  @Field(() => String)
  url: string;
  @Field(() => Boolean)
  isFave: boolean;
  @Field(() => String)
  description: string;
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
  @Field(() => [String])
  tags: Array<String>;
  @Field(() => String)
  contentHTML: string;
  @Field(() => String)
  language: string;
}

@ArgsType()
class PlaybookArticlesRequest {
  @Field(() => Number)
  skip: number;
  @Field(() => Number)
  limit: number;
  @Field(() => String, { nullable: true })
  tag: string;
  @Field(() => String, { nullable: true })
  locale: string;
}

export class PlaybookResolver {
  @Query(() => [PlayBook])
  async playbookArticles(
    @Args() { skip, limit, tag = "" }: PlaybookArticlesRequest
  ): Promise<Array<PlayBook>> {
    const { data } = await axios.get(
      `${SourceUrl}skip=${skip}&limit=${limit}&tag=${encodeURIComponent(tag)}`
    );
    return data.map((item: any) => {
      return {
        ...item,
        url: `https://guanxi.io/${item.id}`,
        isFave: false,
        description: item.description || "",
        forwardedFor: (item.references || [])[0],
        date: new Date(item.date),
        visitorCount: 0
      };
    });
  }
}
