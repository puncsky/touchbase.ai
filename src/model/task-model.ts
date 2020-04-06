import mongoose from "mongoose";
import { TTask } from "../types/task";

const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  // basic profile
  title: { type: String },
  ownerId: { type: "ObjectId", ref: "User" },
  rrule: { type: String },
  due: { type: Date },
  contacts: { type: [String] },
  done: Date,
  delayed: Date,
  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

type TTaskDoc = mongoose.Document &
  TTask & {
    createAt: Date;
    updateAt: Date;
  };

export class TaskModel {
  public Model: mongoose.Model<TTaskDoc>;

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    TaskSchema.index({ name: "text" });
    TaskSchema.index({ ownerId: 1 });

    TaskSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });

    TaskSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    TaskSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Task", TaskSchema);
  }

  public async getTaskByUser(userId: string): Promise<Array<TTask>> {
    return this.Model.find({ ownerId: userId });
  }

  async getTaskByUserAndContactId(
    userId: string,
    contactId: string
  ): Promise<Array<TTask>> {
    return this.Model.find({ ownerId: userId, contacts: { $in: [contactId] } });
  }

  public async createTask(task: TTask): Promise<TTask> {
    return new this.Model(task).save();
  }

  public async upsert(task: TTask): Promise<TTask | null> {
    return this.Model.findOneAndUpdate(
      {
        _id: task.id
      },
      task,
      {
        new: true
      }
    );
  }

  public async deleteTask(id: string, userId: string): Promise<Boolean> {
    const resp = await this.Model.deleteOne({
      _id: id,
      ownerId: userId
    });
    return Boolean(resp && resp.ok);
  }

  async getTaskDued(): Promise<Array<TTask> | null> {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return this.Model.find({ due: { $lte: tmr, $gte: new Date() } }).lean();
  }
}
