import { Arg, Ctx, Field, InputType, Mutation } from "type-graphql";

import { Context } from "../api-gateway";

@InputType()
class DeleteAccountInput {
  @Field(_ => String)
  email: string;
}

export class AccountResolve {
  @Mutation(_ => String)
  public async deleteAccount(
    // @ts-ignore
    @Arg("deleteAccountInput") input: DeleteAccountInput,
    @Ctx() { auth, userId, model }: Context
  ): Promise<string> {
    const user = await auth.user.getById(userId);

    if (user && user.email === input.email) {
      const { contact, event, human, personalNote } = model;
      await contact.deleteAllByOwner({ ownerId: userId });
      await event.deleteAllByOwner({ ownerId: userId });
      await human.deleteAllByOwner({ ownerId: userId });
      await personalNote.deleteAllByOwner({ ownerId: userId });
      await auth.user.deleteById(userId);

      return "OK";
    } else {
      return "ERROR";
    }
  }
}
