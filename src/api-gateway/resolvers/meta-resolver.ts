import { Query } from "type-graphql";

export class MetaResolver {
  @Query(_ => String, { description: "is the server healthy?" })
  public async health(): Promise<string> {
    return "OK";
  }
}
