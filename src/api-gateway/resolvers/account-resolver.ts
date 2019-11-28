import { AuthenticationError } from "apollo-server-errors";
import { Arg, Ctx, Field, InputType, Mutation } from "type-graphql";

import { Context } from "../api-gateway";

@InputType()
class DeleteAccountInput {
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
    } else {
      return Boolean(false);
    }
  }
}
