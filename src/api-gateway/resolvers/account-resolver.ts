import { AuthenticationError } from "apollo-server-errors";
import { Ctx, Mutation } from "type-graphql";

import { Context } from "../api-gateway";

export class AccountResolve {
  @Mutation(_ => Boolean)
  public async deleteAccount(@Ctx() { auth, userId, model }: Context): Promise<
    boolean
  > {
    if (!userId) {
      throw new AuthenticationError(`please login to deleteContactInput`);
    }
    const user = await auth.user.getById(userId);

    if (!user) {
      throw new AuthenticationError(`user is not found`);
    }

    try {
      const { contact, event, human, personalNote } = model;
      await Promise.all([
        contact.deleteAllByOwner({ ownerId: userId }),
        event.deleteAllByOwner({ ownerId: userId }),
        human.deleteAllByOwner({ ownerId: userId }),
        personalNote.deleteAllByOwner({ ownerId: userId }),
        auth.user.deleteById(userId)
      ]);
      return Boolean(true);
    } catch (e) {
      return Boolean(false);
    }
  }
}
