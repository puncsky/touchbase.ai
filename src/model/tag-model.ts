import mongoose from "mongoose";
import { TTag } from "../types/tag";

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  ownerId: { type: "ObjectId", ref: "User" },
  name: { type: String },
  rate: { type: Number },
  contactId: { type: "ObjectId", ref: "Contact" },

  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

type TTagDoc = mongoose.Document &
  TTag & {
    createdAt: Date;
    updatedAt: Date;
  };

export class TagModel {
  public Model: mongoose.Model<TTagDoc>;
  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    TagSchema.index({ contactId: 1 });
    TagSchema.index({ ownerId: 1 });
    TagSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });

    this.Model = mongoose.model("Tag", TagSchema);
  }

  public async getByOwnerId(ownerId: string): Promise<Array<TTag>> {
    return this.Model.find({ ownerId });
  }

  public async getByContactId(contactId: string): Promise<Array<TTag>> {
    return this.Model.find({ contactId });
  }

  public async newAndSave(tag: TTag): Promise<TTag> {
    return new this.Model(tag).save();
  }

  // tslint:disable-next-line:variable-name
  public async deleteOne(_id: string): Promise<Boolean> {
    const resp = await this.Model.deleteOne({ _id });
    return Boolean(resp && resp.ok);
  }
}
