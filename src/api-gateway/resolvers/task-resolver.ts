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
import { TTask } from "../../types/task";
import { Context } from "../api-gateway";
import { populateTask } from "./utils/task-util";

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
  @Field(_ => Date, { nullable: true })
  public done: Date;
  @Field(_ => Date, { nullable: true })
  public delayed: Date;
  @Field(_ => String, { nullable: true })
  public rrule: string;
  @Field(_ => Date, { nullable: true })
  public due: Date;
  @Field(_ => [String], { nullable: true })
  public contacts: Array<string>;
}

@ObjectType()
class Task {
  @Field(_ => String)
  public id: string;
  @Field(_ => String)
  public title: string;
  @Field(_ => Date, { nullable: true })
  public done: Date;
  @Field(_ => [String], { nullable: true })
  public contacts: Array<string>;
  @Field(_ => String, { nullable: true })
  public rrule: string;
  @Field(_ => Date, { nullable: true })
  public due: Date;
  @Field(_ => String)
  public ownerId: string;
}

@ArgsType()
class GetUserTasksRequest {
  @Field(_ => String, { nullable: true })
  public contactId: string;
}

export class TaskResolver {
  @Authorized()
  @Query(_ => [Task])
  public async getUserTasks(
    @Args() { contactId }: GetUserTasksRequest,
    @Ctx() { model, userId }: Context
  ): Promise<Array<TTask>> {
    if (!contactId) {
      return model.task.getTaskByUser(userId);
    }
    return model.task.getTaskByUserAndContactId(userId, contactId);
  }

  @Authorized()
  @Mutation(_ => Boolean)
  public async deleteTask(
    @Args() { id }: DeleteTaskInput,
    @Ctx() { model, userId }: Context
  ): Promise<Boolean> {
    return model.task.deleteTask(id, userId);
  }

  @Authorized()
  @Mutation(_ => Task)
  public async upsertTask(
    @Arg("upsertTaskInput") upsertTaskInput: UpsertTaskInput,
    @Ctx() { model, userId }: Context
  ): Promise<TTask | null> {
    const populated = populateTask({
      ...upsertTaskInput,
      ownerId: userId
    });
    if (!upsertTaskInput.id) {
      return model.task.createTask(populated);
    }

    return model.task.upsert(populated);
  }
}
