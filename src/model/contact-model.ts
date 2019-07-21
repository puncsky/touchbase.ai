import mongoose from "mongoose";
import { TContact } from "../types/contact";

const Schema = mongoose.Schema;
const ContactSchema = new Schema({
  ownerId: { type: "ObjectId", ref: "User" },

  // basic profile
  name: { type: String },
  alias: { type: String },
  avatarUrl: { type: String },
  address: { type: String },
  bornAt: { type: Date },
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

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    ContactSchema.index({ name: 1 });
    ContactSchema.index({ ownerId: 1 });

    ContactSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    ContactSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("Contact", ContactSchema);
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
    return this.Model.find({ ownerId })
      .skip(offset)
      .limit(limit)
      .sort("-updateAt");
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
      }
    );
  }

  public async newAndSave(human: TContact): Promise<TContactDoc> {
    return new this.Model(human).save();
  }

  // tslint:disable-next-line:no-any
  public async findManyIdsByNames(names: Array<string>): Promise<Array<any>> {
    return this.Model.where("name id").find({ name: { $in: names } });
  }
}
