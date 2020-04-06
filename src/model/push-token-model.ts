import mongoose from "mongoose";
import { TPushToken } from "../types/push-token";

const Schema = mongoose.Schema;
const PushTokenSchema = new Schema({
  // basic profile
  ownerId: { type: "ObjectId", ref: "User", unique: true },
  web: { type: String },
  expo: { type: String },
  email: { type: String },

  // systematic
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

type TPushTokenDoc = mongoose.Document &
  TPushToken & {
    createAt: Date;
    updateAt: Date;
  };

export class PushTokenModel {
  public Model: mongoose.Model<TPushTokenDoc>;

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    PushTokenSchema.index({ ownerId: 1 });

    PushTokenSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });

    PushTokenSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    PushTokenSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("push_token", PushTokenSchema);
  }

  public async upsert(pushToken: TPushToken): Promise<TPushToken | null> {
    return this.Model.findOneAndUpdate(
      {
        ownerId: pushToken.ownerId
      },
      pushToken,
      {
        upsert: true,
        new: true
      }
    );
  }

  async getByUser(ownerId: string): Promise<TPushToken | null> {
    return this.Model.findOne({ ownerId });
  }
}
