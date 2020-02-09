import mongoose from "mongoose";
import { TTask } from "../types/task";

const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  ownerId: { type: "ObjectId", ref: "User" },

  // basic profile
  name: { type: String },

  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

type TTaskDoc = mongoose.Document &
  TTask & {
    userId: string;
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
}
