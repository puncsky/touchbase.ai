import { AuthenticationError } from "apollo-server-errors";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  registerEnumType
} from "type-graphql";
import { THuman, TInteraction } from "../../types/human";
import { Context } from "../api-gateway";

export enum AttitudeType {
  empty = "",
  introversion = "introversion",
  extroversion = "extroversion",
  ambiversion = "ambiversion"
}

registerEnumType(AttitudeType, {
  name: "AttitudeType"
});

export enum PerceivingType {
  empty = "",
  intuiting = "intuiting",
  sensing = "sensing"
}

registerEnumType(PerceivingType, {
  name: "PerceivingType"
});

export enum JudgingType {
  empty = "",
  thinking = "thinking",
  feeling = "feeling"
}

registerEnumType(JudgingType, {
  name: "JudgingType"
});

export enum LifestyleType {
  empty = "",
  planing = "planing",
  perceiving = "perceiving"
}

registerEnumType(LifestyleType, {
  name: "LifestyleType"
});

export enum TdpType {
  empty = "",
  creator = "creator",
  refiner = "refiner",
  advancer = "advancer",
  executor = "executor",
  flexor = "flexor"
}

registerEnumType(TdpType, {
  name: "TdpType"
});

@InputType()
class CreateContactInput implements THuman {
  @Field(_ => String, { nullable: true })
  // tslint:disable-next-line:variable-name
  public _id?: string | undefined;
  @Field(_ => String)
  public emails: Array<string>;
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public avatarUrl: string;
  @Field(_ => String)
  public address: string;
  @Field(_ => String)
  public bornAt: string;
  @Field(_ => String)
  public bornAddress: string;
  @Field(_ => String)
  public knownAt: string;
  @Field(_ => String)
  public knownSource: string;
  @Field(_ => AttitudeType)
  public extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  @Field(_ => PerceivingType)
  public intuitingSensing: "" | "intuiting" | "sensing";
  @Field(_ => JudgingType)
  public thinkingFeeling: "" | "thinking" | "feeling";
  @Field(_ => LifestyleType)
  public planingPerceiving: "" | "planing" | "perceiving";
  @Field(_ => TdpType)
  public tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  @Field(_ => String)
  public inboundTrust: 1;
  @Field(_ => String)
  public outboundTrust: 1;
  @Field(_ => String)
  public blurb: string;
  @Field(_ => String)
  public workingOn: string;
  @Field(_ => String)
  public desire: string;
  @Field(_ => String)
  public title: string;
  @Field(_ => String)
  @Field(_ => String)
  public experience: [{ title: string; name: string }];
  @Field(_ => String)
  public education: [{ title: string; name: string }];
  @Field(_ => String)
  public linkedin: string;
  @Field(_ => String)
  public facebook: string;
  @Field(_ => String, { nullable: true })
  public createdAt?: string | undefined;
  @Field(_ => String, { nullable: true })
  public updatedAt?: string | undefined;
}

@ObjectType()
class Contact implements THuman {
  @Field(_ => String, { nullable: true })
  // tslint:disable-next-line:variable-name
  public _id?: string | undefined;
  @Field(_ => String)
  public emails: Array<string>;
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public avatarUrl: string;
  @Field(_ => String)
  public address: string;
  @Field(_ => String)
  public bornAt: string;
  @Field(_ => String)
  public bornAddress: string;
  @Field(_ => String)
  public knownAt: string;
  @Field(_ => String)
  public knownSource: string;
  @Field(_ => AttitudeType)
  public extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  @Field(_ => PerceivingType)
  public intuitingSensing: "" | "intuiting" | "sensing";
  @Field(_ => JudgingType)
  public thinkingFeeling: "" | "thinking" | "feeling";
  @Field(_ => LifestyleType)
  public planingPerceiving: "" | "planing" | "perceiving";
  @Field(_ => TdpType)
  public tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  @Field(_ => String)
  public inboundTrust: 1;
  @Field(_ => String)
  public outboundTrust: 1;
  @Field(_ => String)
  public blurb: string;
  @Field(_ => String)
  public workingOn: string;
  @Field(_ => String)
  public desire: string;
  @Field(_ => String)
  public title: string;
  @Field(_ => String)
  @Field(_ => String)
  public experience: [{ title: string; name: string }];
  @Field(_ => String)
  public education: [{ title: string; name: string }];
  @Field(_ => String)
  public linkedin: string;
  @Field(_ => String)
  public facebook: string;
  @Field(_ => String, { nullable: true })
  public createdAt?: string | undefined;
  @Field(_ => String, { nullable: true })
  public updatedAt?: string | undefined;
}

@ObjectType()
class Interaction implements TInteraction {
  @Field(_ => String)
  public id: string;
  @Field(_ => Date)
  public timestamp: Date;
  @Field(_ => String)
  public content: string;
  @Field(_ => String, { nullable: true })
  public contentHtml: string;
}

@ArgsType()
class GetInteractions {
  @Field(_ => String, { nullable: true })
  public contactId: string;

  @Field(_ => Number, { nullable: true })
  public offset?: number;

  @Field(_ => Number, { nullable: true })
  public limit?: number;
}

@ArgsType()
class SearchRequest {
  @Field(_ => String)
  public name: string;
}

interface ISearchResult {}

@ObjectType()
class SearchResult implements ISearchResult {
  @Field(_ => String)
  public name: string;

  @Field(_ => String)
  public path: string;
}

export class ContactResolver {
  @Mutation(_ => Contact)
  public async createContact(
    @Arg("createContactInput") createContactInput: CreateContactInput,
    @Ctx() { model, userId }: Context
  ): Promise<Contact> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch personal notes`);
    }

    return model.human.newAndSave({ ...createContactInput, ownerId: userId });
  }

  @Query(_ => [Interaction])
  public async interactions(
    @Args() { contactId, offset, limit }: GetInteractions,
    @Ctx() { model, userId }: Context
  ): Promise<Array<Interaction>> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch personal notes`);
    }

    return model.event.getAllByOwnerIdRelatedHumanId({
      ownerId: userId,
      humanId: contactId,
      skip: offset,
      limit
    });
  }

  @Query(_ => [SearchResult])
  public async search(
    @Args() { name }: SearchRequest,
    @Ctx() { model, userId }: Context
  ): Promise<Array<SearchResult>> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch personal notes`);
    }
    const entries = await model.contact.findName({ name, ownerId: userId });
    return entries.map(en => ({
      name: en.name,
      path: `/${en.name.replace(/ /g, ".")}/`
    }));
  }
}
