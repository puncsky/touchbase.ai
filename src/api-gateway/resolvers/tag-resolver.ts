import {
  Arg,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query
} from "type-graphql";
import { TTag } from "../../types/tag";
import { Context } from "../api-gateway";

@InputType()
class CreateTagInput implements TTag {
  @Field(_ => String)
  public name: string;
  @Field(_ => Number)
  public rate: number;
  @Field(_ => String)
  public contactId: string;
  @Field(_ => String)
  public ownerId: string;
}

@InputType()
class DeleteTagInput {
  @Field(_ => String)
  id: string;
}

@ArgsType()
class GetContactTags {
  @Field(_ => String)
  public contactId: string;
}

@ObjectType()
class Tag implements TTag {
  @Field(_ => String)
  // tslint:disable-next-line:variable-name
  public _id?: string | undefined;
  @Field(_ => String)
  public contactId: string;
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public ownerId: string;
  @Field(_ => Number)
  public rate: number;
}

export class TagResolver {
  @Mutation(_ => Tag)
  public async createTag(
    @Arg("createTagInput") createTagInput: CreateTagInput,
    @Ctx() { model, userId }: Context
  ): Promise<TTag> {
    return model.tag.newAndSave({
      ...createTagInput,
      ownerId: userId
    });
  }

  @Mutation(_ => Boolean)
  public async deleteTag(
    @Arg("deleteTagInput") deleteTagInput: DeleteTagInput,
    @Ctx() { model }: Context
  ): Promise<Boolean> {
    const id = deleteTagInput.id;
    return model.tag.deleteOne(id);
  }

  @Query(_ => [Tag])
  public async getUserTags(
    @Ctx() { model, userId }: Context
  ): Promise<Array<TTag>> {
    return model.tag.getByOwnerId(userId);
  }

  @Query(_ => [Tag])
  public async getContactTags(
    @Arg("getContactTags") getContactTags: GetContactTags,
    @Ctx() { model }: Context
  ): Promise<Array<TTag>> {
    return model.tag.getByContactId(getContactTags.contactId);
  }
}
