import { TPersonalNote } from "../types/contact";

import { ObjectId } from "mongodb";
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

      public: { type: Boolean },

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

  async count(
    ownerId: string,
    id: string | null
  ): Promise<Array<{ date: string; count: number }>> {
    const match: any = { ownerId };
    if (id) {
      match.relatedHumans = new ObjectId(id);
    }
    const resp: Array<Aggregated> = await this.Model.aggregate([
      {
        $match: match
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: "$createAt"
            },
            month: {
              $month: "$createAt"
            },
            year: {
              $year: "$createAt"
            }
          },
          count: {
            $sum: 1
          }
        }
      }
    ]);
    return resp.map((a: Aggregated) => {
      return {
        date: `${a._id.year}-${String(a._id.month).padStart(2, "0")}-${String(
          a._id.day
        ).padStart(2, "0")}`,
        count: a.count
      };
    });
  }

  public async getPublicById(id: string): Promise<TPersonalNoteDoc | null> {
    return this.Model.findOne({ _id: id, public: true });
  }

  public async getByIdAndOwner(
    id: string,
    ownerUserId: string
  ): Promise<TPersonalNoteDoc | null> {
    return this.Model.findOne({ _id: id, ownerId: ownerUserId });
  }

  public async getAllByOwnerIdRelatedHumanId({
    ownerId,
    humanId,
    skip,
    limit
  }: {
    ownerId: string;
    humanId?: string;
    skip?: number;
    limit?: number;
  }): Promise<Array<TPersonalNoteDoc>> {
    let query: any = {
      ownerId
    };
    if (humanId) {
      query = {
        ownerId,
        relatedHumans: humanId
      };
    }
    let resp = this.Model.find(query).sort({
      timestamp: "desc"
    });
    if (skip !== undefined) {
      resp = resp.skip(skip);
    }
    if (limit !== undefined) {
      resp = resp.limit(limit);
    }
    return resp;
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

  public async add(entry: any): Promise<TPersonalNoteDoc> {
    return new this.Model(entry).save();
  }

  public async deleteOne({
    _id,
    ownerId
  }: {
    _id: string;
    ownerId: string;
  }): Promise<Boolean> {
    const resp = await this.Model.deleteOne({ _id, ownerId });
    return Boolean(resp && resp.ok);
  }
}

export interface Aggregated {
  _id: Id;
  count: number;
}
export interface Id {
  day: number;
  month: number;
  year: number;
}
