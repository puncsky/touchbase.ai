import { Args, ArgsType, Ctx, Field, Query } from "type-graphql";
import { Context } from "../api-gateway";

@ArgsType()
class FullContactReqeust {
  @Field(_ => String, { nullable: true })
  email: string;
  @Field(_ => String, { nullable: true })
  emailHash: string;
  @Field(_ => String, { nullable: true })
  twitter: string;
  @Field(_ => String, { nullable: true })
  phone: string;
}

export class MetaResolver {
  @Query(_ => String, { description: "is the server healthy?" })
  public async health(): Promise<string> {
    return "OK";
  }

  @Query(_ => String)
  public async fullContact(
    @Args() fullContactRequest: FullContactReqeust,
    @Ctx() { gateways }: Context
  ): Promise<string> {
    return JSON.stringify(
      await gateways.fullcontact.getPerson(fullContactRequest)
    );
  }
}
