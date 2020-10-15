import mongoose from "mongoose";
import { TContact } from "../types/contact";

const { Schema } = mongoose;
const ContactSchema = new Schema({
  ownerId: { type: "ObjectId", ref: "User" },

  // basic profile
  name: { type: String },
  alias: { type: String },
  avatarUrl: { type: String },
  address: { type: String },
  bornAt: { type: String },
  bornAddress: { type: String },
  blurb: { type: String },
  gender: { type: String, enum: ["F", "M"] },

  // desires
  workingOn: { type: String },
  desire: { type: String },

  // resume
  experience: [
    {
      title: String,
      name: String,
      fromDate: Date,
      toDate: Date
    }
  ],
  education: [
    {
      title: String,
      name: String,
      fromDate: Date,
      toDate: Date
    }
  ],

  // interactions
  knownSource: String,
  knownAt: Date,

  // contacts
  emails: [{ type: String }],
  linkedin: { type: String },
  wechat: { type: String },
  facebook: { type: String },
  github: { type: String },
  phones: [{ type: String }],

  // personalities
  extraversionIntroversion: {
    type: String,
    enum: ["", "introversion", "extroversion", "ambiversion"]
  },
  intuitingSensing: {
    type: String,
    enum: ["", "intuiting", "sensing"]
  },
  thinkingFeeling: {
    type: String,
    enum: ["", "thinking", "feeling"]
  },
  planingPerceiving: {
    type: String,
    enum: ["", "planing", "perceiving"]
  },
  tdp: {
    type: String,
    enum: ["", "creator", "refiner", "advancer", "executor", "flexor"]
  },

  // ratings
  inboundTrust: {
    type: Number,
    min: 1,
    max: 5
  },
  outboundTrust: {
    type: Number,
    min: 1,
    max: 5
  },

  hmacs: { type: [String] },

  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

type TContactDoc = mongoose.Document &
  TContact & {
    userId: string;
    createAt: Date;
    updateAt: Date;
  };

export class ContactModel {
  public Model: mongoose.Model<TContactDoc>;

  constructor({ mongoose: instance }: { mongoose: mongoose.Mongoose }) {
    ContactSchema.index({ name: "text" });
    ContactSchema.index({ ownerId: 1 });
    ContactSchema.index({ hmacs: 1 });

    ContactSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });

    ContactSchema.pre("save", function onSave(next: () => unknown): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    ContactSchema.pre("find", function onFind(next: () => unknown): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = instance.model("Contact", ContactSchema);
  }

  public async getByName(
    ownerId: string,
    name: string
  ): Promise<TContactDoc | null> {
    return this.Model.findOne({ ownerId, name });
  }

  public async getById(
    ownerId: string,
    id: string
  ): Promise<TContactDoc | null> {
    return this.Model.findOne({ ownerId, _id: id });
  }

  public async findById(
    ownerId: string,
    offset: number,
    limit: number
  ): Promise<Array<TContactDoc>> {
    let found = this.Model.find({ ownerId });
    if (offset !== undefined) {
      found = found.skip(offset);
    }
    if (limit !== undefined) {
      found = found.limit(limit);
    }

    return found.sort("-updateAt");
  }

  public async updateOne(
    id: string,
    ownerId: string,
    human: TContact
  ): Promise<TContactDoc | null> {
    return this.Model.findOneAndUpdate(
      { _id: id, ownerId },
      {
        $set: human
      },
      {
        new: true
      }
    );
  }

  public async newAndSave(human: TContact): Promise<TContactDoc> {
    return new this.Model(human).save();
  }

  public async deleteOne({
    _id,
    ownerId
  }: {
    _id: string;
    ownerId: string;
  }): Promise<boolean> {
    const resp = await this.Model.deleteOne({ _id, ownerId });
    return Boolean(resp && resp.ok);
  }

  public async deleteAllByOwner({
    ownerId
  }: {
    ownerId: string;
  }): Promise<boolean> {
    const resp = await this.Model.deleteMany({ ownerId });
    return Boolean(resp && resp.ok);
  }

  // tslint:disable-next-line:no-any
  public async findManyIdsByNames(names: Array<string>): Promise<Array<any>> {
    return this.Model.where("name id").find({ name: { $in: names } });
  }

  public async findName({
    name,
    ownerId
  }: {
    name: string;
    ownerId: string;
  }): Promise<Array<TContact>> {
    return this.Model.find({ $text: { $search: name }, ownerId }).select(
      "name _id"
    );
  }

  async findHmacs({
    hmacs,
    ownerId
  }: {
    hmacs: Array<string>;
    ownerId: string;
  }): Promise<Array<TContact>> {
    return this.Model.find({ hmacs: { $in: hmacs }, ownerId }).select(
      "name _id"
    );
  }
}
