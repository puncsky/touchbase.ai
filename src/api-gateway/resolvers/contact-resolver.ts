/* tslint:disable:variable-name */
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
  Query
} from "type-graphql";
import { TPersonalNote } from "../../types/contact";
import { TContact2, TInteraction } from "../../types/human";
import { Context } from "../api-gateway";

@InputType()
class DeleteContactInput {
  @Field(_ => String)
  _id: string;
}

@InputType()
class DeleteNoteInput {
  @Field(_ => String)
  _id: string;
}

@InputType()
class CreateContactInput implements TContact2 {
  @Field(_ => String, { nullable: true })
  public _id?: string | undefined;

  @Field(_ => String, { nullable: true })
  public emails: Array<string>;
  @Field(_ => String, { nullable: true })
  public name: string;
  @Field(_ => String, { nullable: true })
  public phones: Array<string>;
  @Field(_ => String, { nullable: true })
  public avatarUrl: string;
  @Field(_ => String, { nullable: true })
  public address: string;
  @Field(_ => String, { nullable: true })
  public bornAt: string;
  @Field(_ => String, { nullable: true })
  public bornAddress: string;
  @Field(_ => Date, { nullable: true })
  public knownAt: Date;
  @Field(_ => String, { nullable: true })
  public knownSource: string;
  @Field(_ => String, { nullable: true })
  public extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  @Field(_ => String, { nullable: true })
  public intuitingSensing: "" | "intuiting" | "sensing";
  @Field(_ => String, { nullable: true })
  public thinkingFeeling: "" | "thinking" | "feeling";
  @Field(_ => String, { nullable: true })
  public planingPerceiving: "" | "planing" | "perceiving";
  @Field(_ => String, { nullable: true })
  public tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  @Field(_ => Number, { nullable: true })
  public inboundTrust: number;
  @Field(_ => Number, { nullable: true })
  public outboundTrust: number;
  @Field(_ => String, { nullable: true })
  public blurb: string;
  @Field(_ => String, { nullable: true })
  public workingOn: string;
  @Field(_ => String, { nullable: true })
  public desire: string;
  @Field(_ => String, { nullable: true })
  public title: string;
  @Field(_ => [ExperienceInput], { nullable: true })
  public experience: [ExperienceInput];
  @Field(_ => [ExperienceInput], { nullable: true })
  public education: [ExperienceInput];
  @Field(_ => String, { nullable: true })
  public linkedin: string;
  @Field(_ => String, { nullable: true })
  public facebook: string;
  @Field(_ => Date, { nullable: true })
  public createAt?: Date;
  @Field(_ => Date, { nullable: true })
  public updateAt?: Date;
}

@InputType()
class UpdateContactInput implements TContact2 {
  @Field(_ => String)
  public _id: string;

  @Field(_ => String, { nullable: true })
  public emails: Array<string>;
  @Field(_ => String, { nullable: true })
  public name: string;
  @Field(_ => String, { nullable: true })
  public phones: Array<string>;
  @Field(_ => String, { nullable: true })
  public avatarUrl: string;
  @Field(_ => String, { nullable: true })
  public address: string;
  @Field(_ => Date, { nullable: true })
  public bornAt: string;
  @Field(_ => String, { nullable: true })
  public bornAddress: string;
  @Field(_ => Date, { nullable: true })
  public knownAt: Date;
  @Field(_ => String, { nullable: true })
  public knownSource: string;
  @Field(_ => String, { nullable: true })
  public extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  @Field(_ => String, { nullable: true })
  public intuitingSensing: "" | "intuiting" | "sensing";
  @Field(_ => String, { nullable: true })
  public thinkingFeeling: "" | "thinking" | "feeling";
  @Field(_ => String, { nullable: true })
  public planingPerceiving: "" | "planing" | "perceiving";
  @Field(_ => String, { nullable: true })
  public tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  @Field(_ => Number, { nullable: true })
  public inboundTrust: number;
  @Field(_ => Number, { nullable: true })
  public outboundTrust: number;
  @Field(_ => String, { nullable: true })
  public blurb: string;
  @Field(_ => String, { nullable: true })
  public workingOn: string;
  @Field(_ => String, { nullable: true })
  public desire: string;
  @Field(_ => String, { nullable: true })
  public title: string;
  @Field(_ => [ExperienceInput])
  public experience: [ExperienceInput];
  @Field(_ => [ExperienceInput])
  public education: [ExperienceInput];
  @Field(_ => String, { nullable: true })
  public linkedin: string;
  @Field(_ => String, { nullable: true })
  public facebook: string;
  @Field(_ => Date, { nullable: true })
  public createAt?: Date;
  @Field(_ => Date, { nullable: true })
  public updateAt?: Date;
}

@ObjectType()
class Contact implements TContact2 {
  @Field(_ => String)
  // tslint:disable-next-line:variable-name
  public _id: string;

  @Field(_ => String, { nullable: true })
  public emails: Array<string>;
  @Field(_ => String, { nullable: true })
  public name: string;
  @Field(_ => String, { nullable: true })
  public phones: Array<string>;
  @Field(_ => String, { nullable: true })
  public avatarUrl: string;
  @Field(_ => String, { nullable: true })
  public address: string;
  @Field(_ => Date, { nullable: true })
  public bornAt: string;
  @Field(_ => String, { nullable: true })
  public bornAddress: string;
  @Field(_ => Date, { nullable: true })
  public knownAt: Date;
  @Field(_ => String, { nullable: true })
  public knownSource: string;
  @Field(_ => String, { nullable: true })
  public extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  @Field(_ => String, { nullable: true })
  public intuitingSensing: "" | "intuiting" | "sensing";
  @Field(_ => String, { nullable: true })
  public thinkingFeeling: "" | "thinking" | "feeling";
  @Field(_ => String, { nullable: true })
  public planingPerceiving: "" | "planing" | "perceiving";
  @Field(_ => String, { nullable: true })
  public tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  @Field(_ => Number, { nullable: true })
  public inboundTrust: number;
  @Field(_ => Number, { nullable: true })
  public outboundTrust: number;
  @Field(_ => String, { nullable: true })
  public blurb: string;
  @Field(_ => String, { nullable: true })
  public workingOn: string;
  @Field(_ => String, { nullable: true })
  public desire: string;
  @Field(_ => String, { nullable: true })
  public title: string;
  @Field(_ => [Experience])
  public experience: [Experience];
  @Field(_ => [Experience])
  public education: [Experience];
  @Field(_ => String, { nullable: true })
  public linkedin: string;
  @Field(_ => String, { nullable: true })
  public facebook: string;
  @Field(_ => Date, { nullable: true })
  public createAt?: Date;
  @Field(_ => Date, { nullable: true })
  public updateAt?: Date;
}

@ObjectType()
class Experience {
  @Field(_ => String, { nullable: true })
  public title: string;
  @Field(_ => String, { nullable: true })
  public name: string;
}

@InputType()
class ExperienceInput {
  @Field(_ => String, { nullable: true })
  public title: string;
  @Field(_ => String, { nullable: true })
  public name: string;
}

@ObjectType()
class Interaction implements TInteraction {
  @Field(_ => String)
  public id: string;
  @Field(_ => Date)
  public timestamp: Date;
  @Field(_ => String)
  public content: string;
  @Field(_ => [String])
  public relatedHumans: Array<string>;
  @Field(_ => Boolean, { nullable: true })
  public public?: boolean;
}

@InputType()
class UpsertInteraction implements TInteraction {
  @Field(_ => String)
  public id: string;
  @Field(_ => Date)
  public timestamp: Date;
  @Field(_ => String)
  public content: string;
  @Field(_ => [String])
  public relatedHumans: Array<string>;
  @Field(_ => Boolean)
  public public: boolean;
}

@ArgsType()
class GetInteractions {
  @Field(_ => String, { nullable: true })
  public contactId: string;

  @Field(_ => Boolean, { nullable: true })
  public isSelf: boolean;

  @Field(_ => Number, { nullable: true })
  public offset?: number;

  @Field(_ => Number, { nullable: true })
  public limit?: number;
}

@ArgsType()
class GetNote {
  @Field(_ => String)
  public id: string;
}

@ArgsType()
class SearchRequest {
  @Field(_ => String)
  public name: string;
}

@ArgsType()
class InteractionCountsRequest {
  @Field(_ => Boolean, { nullable: true })
  public isSelf: string;

  @Field(_ => String, { nullable: true })
  public contactId: string;
}

@ObjectType()
class InteractionCount {
  @Field(_ => String)
  public date: string;
  @Field(_ => Number)
  public count: number;
}

@ArgsType()
class ContactsRequest {
  @Field(_ => Number, { nullable: true })
  offset: number;

  @Field(_ => Number, { nullable: true })
  limit: number;
}

@ArgsType()
class ContactRequest {
  @Field(_ => String, { nullable: true })
  public id?: string;
  @Field(_ => String, { nullable: true })
  public userId?: string;
  @Field(_ => Boolean, { nullable: true })
  public isSelf: boolean;
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
      throw new AuthenticationError(`please login to createContact`);
    }

    return model.human.newAndSave({ ...createContactInput, ownerId: userId });
  }

  @Mutation(_ => Contact)
  public async updateContact(
    @Arg("updateContactInput") updateContactInput: UpdateContactInput,
    @Ctx() { model, userId }: Context
  ): Promise<Contact | null> {
    if (!userId) {
      throw new AuthenticationError(`please login to updateContactInput`);
    }

    return model.human.updateOne(
      updateContactInput._id,
      userId,
      updateContactInput
    );
  }

  @Query(_ => [Interaction])
  public async interactions(
    @Args() { contactId, offset, limit, isSelf }: GetInteractions,
    @Ctx() { model, userId }: Context
  ): Promise<Array<Interaction>> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch interactions`);
    }
    return model.event.getAllByOwnerIdRelatedHumanId({
      ownerId: userId,
      humanId: isSelf ? undefined : contactId,
      skip: offset,
      limit
    });
  }

  @Query(_ => Interaction, { nullable: true })
  public async note(
    @Args() { id }: GetNote,
    @Ctx() { model, userId }: Context
  ): Promise<Interaction | null> {
    const foundPublic = await model.event.getPublicById(id);
    if (foundPublic) {
      return foundPublic;
    }
    if (!foundPublic && !userId) {
      return null;
    }
    return model.event.getByIdAndOwner(id, userId);
  }

  @Mutation(_ => Boolean)
  public async deleteNote(
    @Arg("deleteNoteInput") deleteNoteInput: DeleteNoteInput,
    @Ctx() { model, userId }: Context
  ): Promise<Boolean> {
    if (!userId) {
      throw new AuthenticationError(`please login to deleteNoteInput`);
    }

    return model.personalNote.deleteOne({
      ...deleteNoteInput,
      ownerId: userId
    });
  }

  @Mutation(_ => Interaction)
  public async upsertInteraction(
    @Arg("upsertInteraction") item: UpsertInteraction,
    @Ctx() { model, userId }: Context
  ): Promise<Interaction | null> {
    if (!userId) {
      throw new AuthenticationError(`please login to upsertInteraction`);
    }

    const found = item.content.match(/@([a-zA-Z\u4e00-\u9fa5.]+)/g) || [];
    const usernames = found.map(it => it.replace("@", "").replace(".", " "));
    const humans = await model.human.findManyIdsByNames(usernames);

    const associatedItem: TInteraction = item;

    associatedItem.relatedHumans = [
      ...associatedItem.relatedHumans,
      ...humans.map((h: TPersonalNote) => h.id)
    ];
    const ownedItem = { ...associatedItem, ownerId: userId };
    if (!item.id) {
      ownedItem.timestamp = ownedItem.timestamp || new Date();
      return model.event.add(ownedItem);
    }
    return model.event.updateOne(item.id, userId, ownedItem);
  }

  @Query(_ => [SearchResult])
  public async search(
    @Args() { name }: SearchRequest,
    @Ctx() { model, userId }: Context
  ): Promise<Array<SearchResult>> {
    if (!userId) {
      throw new AuthenticationError(`please login to search`);
    }
    const entries = await model.contact.findName({ name, ownerId: userId });
    return entries.map(en => ({
      name: en.name,
      path: `/${en._id}/`
    }));
  }

  @Query(_ => [Contact], { nullable: true })
  public async contacts(
    @Args() { offset, limit }: ContactsRequest,
    @Ctx() { model, userId }: Context
  ): Promise<Array<Contact | null>> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch contacts`);
    }
    return model.human.findById(userId, offset, limit);
  }

  @Query(_ => Contact, { nullable: true })
  public async contact(
    @Args() req: ContactRequest,
    @Ctx() { model, userId, auth }: Context
  ): Promise<Contact | null> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch contact`);
    }
    if (req.userId || req.isSelf) {
      if (req.userId !== String(userId) && !req.isSelf) {
        throw new AuthenticationError(
          `fetching a contact not belonging to current user`
        );
      }
      const user = await auth.user.getById(userId);
      if (!user) {
        throw new AuthenticationError(`user is not found`);
      }
      const contact = await model.contact.getById(userId, user.lifetimeHumanId);
      if (!contact) {
        return null;
      }
      if (
        !contact.emails ||
        contact.emails.length === 0 ||
        !contact.emails[0]
      ) {
        contact.emails = [user.email];
      }
      return contact;
    }
    if (req.id) {
      return model.contact.getById(userId, req.id);
    }
    return null;
  }

  @Mutation(_ => Boolean)
  public async deleteContact(
    @Arg("deleteContactInput") deleteContactInput: DeleteContactInput,
    @Ctx() { model, userId, auth, ctx }: Context
  ): Promise<Boolean> {
    if (!userId) {
      throw new AuthenticationError(`please login to deleteContactInput`);
    }
    const user = await auth.user.getById(userId);
    if (!user) {
      throw new AuthenticationError(`please login to deleteContactInput`);
    }
    if (String(user.lifetimeHumanId) === deleteContactInput._id) {
      // @ts-ignore
      throw new Error(ctx.t("field.delete_contact.error_self"));
    }

    return model.human.deleteOne({ ...deleteContactInput, ownerId: userId });
  }

  @Query(_ => [InteractionCount], { nullable: true })
  public async interactionCounts(
    @Args() { contactId, isSelf }: InteractionCountsRequest,
    @Ctx() { model, userId }: Context
  ): Promise<Array<InteractionCount | null>> {
    if (!userId) {
      throw new AuthenticationError(`please login to fetch interactionCounts`);
    }
    return model.event.count(userId, isSelf ? null : contactId);
  }
}
