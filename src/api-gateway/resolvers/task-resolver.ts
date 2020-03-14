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
import { TTask } from "../../types/task";
import { Context } from "../api-gateway";

@ArgsType()
class DeleteTaskInput {
  @Field(_ => String)
  public id: string;
}

@InputType()
class UpsertTaskInput {
  @Field(_ => String, { nullable: true })
  public id?: string;
  @Field(_ => String)
  public title: string;
  @Field(_ => Boolean)
  public done: boolean;
  @Field(_ => String)
  public rrule: string;
  @Field(_ => Date)
  public due: Date;
  @Field(_ => [String])
  public contacts: Array<string>;
}

@ObjectType()
class Task {
  @Field(_ => String)
  public id: string;
  @Field(_ => String)
  public title: string;
  @Field(_ => Boolean)
  public done: boolean;
  @Field(_ => [String])
  public contacts: Array<string>;
  @Field(_ => String)
  public rrule: string;
  @Field(_ => Date)
  public due: Date;
  @Field(_ => String)
  public ownerId: string;
}

export class TaskResolver {
  @Query(_ => [Task])
  public async getUserTasks(
    @Ctx() { model, userId }: Context
  ): Promise<Array<TTask>> {
    if (!userId) {
      throw new AuthenticationError(`please login to getUserTasks`);
    }
    return model.task.getTaskByUser(userId);
  }

  @Mutation(_ => Boolean)
  public async deleteTask(
    @Args() { id }: DeleteTaskInput,
    @Ctx() { model, userId }: Context
  ): Promise<Boolean> {
    if (!userId) {
      throw new AuthenticationError(`please login to deleteTask`);
    }
    return model.task.deleteTask(id, userId);
  }

  @Mutation(_ => Task)
  public async upsertTask(
    @Arg("upsertTaskInput") upsertTaskInput: UpsertTaskInput,
    @Ctx() { model, userId }: Context
  ): Promise<TTask | null> {
    if (!userId) {
      throw new AuthenticationError(`please login to upsertTask`);
    }
    if (!upsertTaskInput.id) {
      return model.task.createTask({
        ...upsertTaskInput,
        ownerId: userId
      });
    }
    return model.task.upsert({
      ...upsertTaskInput,
      ownerId: userId
    });
  }
}
