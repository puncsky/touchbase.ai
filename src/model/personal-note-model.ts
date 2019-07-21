import { TPersonalNote } from "../types/contact";

import mongoose from "mongoose";
const Schema = mongoose.Schema;

type TPersonalNoteDoc = mongoose.Document &
  TPersonalNote & {
    userId: string;
    createAt: Date;
    updateAt: Date;
  };

export class PersonalNoteModel {
  public Model: mongoose.Model<TPersonalNoteDoc>;

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    const schema = new Schema({
      ownerId: { type: "ObjectId", ref: "User" },
      relatedHumans: [{ type: "ObjectId", ref: "Contact" }],
      content: { type: String },
      timestamp: { type: Date, default: Date.now },

      // systematic
      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    schema.index({ ownerId: 1 });
    schema.index({ relatedHumans: 1 });

    schema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    schema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("personal_note", schema);
  }

  public async getById(id: string): Promise<TPersonalNoteDoc | null> {
    return this.Model.findOne({ _id: id });
  }

  public async getAllByOwnerIdRelatedHumanId(
    ownerId: string,
    humanId: string
  ): Promise<Array<TPersonalNoteDoc>> {
    return this.Model.find({ ownerId, relatedHumans: humanId }).sort({
      timestamp: "desc"
    });
  }

  public async updateOne(
    id: string,
    ownerId: string,
    event: TPersonalNote
  ): Promise<TPersonalNoteDoc | null> {
    return this.Model.findOneAndUpdate({ _id: id, ownerId }, { $set: event });
  }

  public async newAndSave(entry: TPersonalNote): Promise<TPersonalNoteDoc> {
    return new this.Model(entry).save();
  }
}
