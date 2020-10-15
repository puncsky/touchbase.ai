import { AuthenticationError } from "apollo-server-errors";
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query
} from "type-graphql";

import { Context } from "../api-gateway";

@InputType()
class DeleteAccountInput {
  @Field(_ => String)
  email: string;
}

@ArgsType()
class UserProfileRequest {
  @Field(_ => String)
  userId: string;
}

@ObjectType()
class UserProfileResponse {
  @Field(_ => String)
  email: string;
}

export class AccountResolver {
  @Mutation(_ => Boolean)
  public async deleteAccount(
    @Arg("deleteAccountInput") input: DeleteAccountInput,
    @Ctx() { auth, userId, model }: Context
  ): Promise<boolean> {
    if (!userId) {
      throw new AuthenticationError(`please login to deleteContactInput`);
    }
    const user = await auth.user.getById(userId);

    if (!user) {
      throw new AuthenticationError(`user is not found`);
    }

    if (user.email === input.email) {
      const { contact, event, human, personalNote } = model;
      await Promise.all([
        contact.deleteAllByOwner({ ownerId: userId }),
        event.deleteAllByOwner({ ownerId: userId }),
        human.deleteAllByOwner({ ownerId: userId }),
        personalNote.deleteAllByOwner({ ownerId: userId }),
        auth.user.deleteById(userId)
      ]);
      return Boolean(true);
    }
    return Boolean(false);
  }

  @Authorized()
  @Query(_ => UserProfileResponse, {
    description: "get the user",
    nullable: true
  })
  public async userProfile(
    @Args()
    args: UserProfileRequest,
    @Ctx()
    ctx: Context
  ): Promise<UserProfileResponse | null> {
    return ctx.auth.user.getById(args.userId);
  }
}
