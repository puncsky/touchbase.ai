import mongoose from "mongoose";
import { TTag, TTagTemplate } from "../types/tag";

const Schema = mongoose.Schema;

const TagTemplateSchema = new Schema({
  name: { type: String },
  ownerId: { type: "ObjectId", ref: "User" },
  hasRate: { type: Boolean },
  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

const TagSchema = new Schema({
  name: { type: String },
  hasRate: { type: Boolean },
  rate: { type: Number },
  ownerId: { type: "ObjectId", ref: "User" },
  contactId: { type: "ObjectId", ref: "Contact" },
  templateId: { type: "ObjectId", ref: "TagTemplate" },
  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

type TTagDoc = mongoose.Document &
  TTag & {
    createdAt: Date;
    updatedAt: Date;
  };

type TTagTemplateDoc = mongoose.Document &
  TTagTemplate & {
    createdAt: Date;
    updatedAt: Date;
  };

export class TagModel {
  public TagModel: mongoose.Model<TTagDoc>;
  public TagTemplateModel: mongoose.Model<TTagTemplateDoc>;

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    TagSchema.index({ contactId: 1 });
    TagSchema.index({ templateId: 1 });
    TagSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });

    TagTemplateSchema.index({ ownerId: 1 });
    TagTemplateSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });

    this.TagModel = mongoose.model("Tag", TagSchema);
    this.TagTemplateModel = mongoose.model("TagTemplate", TagTemplateSchema);
  }

  public async createTemplate(
    template: TTagTemplate
  ): Promise<TTagTemplateDoc> {
    return new this.TagTemplateModel(template).save();
  }

  public async createTag(tag: TTag): Promise<TTagDoc> {
    return new this.TagModel(tag).save();
  }

  public async getTemplatesByOwnerId(
    ownerId: string
  ): Promise<Array<TTagTemplateDoc>> {
    return this.TagTemplateModel.find({ ownerId });
  }

  public async getTagsByContactId(contactId: string): Promise<Array<TTagDoc>> {
    return this.TagModel.find({ contactId });
  }

  public async deleteTag(id: string): Promise<Boolean> {
    const resp = await this.TagModel.deleteOne({ _id: id });
    return Boolean(resp && resp.ok);
  }

  public async deleteTemplate(id: string): Promise<Boolean> {
    const resp = await this.TagTemplateModel.deleteOne({ _id: id });
    return Boolean(resp && resp.ok);
  }

  public async findAndUpdateTagRate({
    id,
    rate
  }: {
    id: string;
    rate: number;
  }): Promise<TTagDoc | null> {
    return this.TagModel.findOneAndUpdate(
      { _id: id },
      { rate },
      {
        new: true
      }
    );
  }

  public async getTagTemplateById(id: string): Promise<TTagTemplateDoc | null> {
    return this.TagTemplateModel.findById(id);
  }
}
