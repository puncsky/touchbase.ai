import mongoose from "mongoose";
import tools from "../utils/tools";
import { baseModel } from "./base-model";

const Schema = mongoose.Schema;

type TNewUser = {
  password: string;
  email: string;
  ip: string;
};

type TDidUser = {
  did: string;
};

type TUser = TNewUser &
  TDidUser & {
    id: string;
    avatar: string;

    isBlocked: boolean;
    lifetimeHumanId: string;

    privateKeyCipher?: string;

    createAt: Date;
    updateAt: Date;
  };

export type TUserDoc = mongoose.Document & TUser;

export class UserModel {
  public Model: mongoose.Model<TUserDoc>;

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    const UserSchema = new Schema({
      password: { type: String },
      email: { type: String },
      ip: { type: String },
      avatar: { type: String },

      lifetimeHumanId: { type: "ObjectId", ref: "LifetimeHuman" },

      isBlocked: { type: Boolean, default: false },

      did: { type: String },
      privateKeyCipher: { type: String },

      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    UserSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });
    UserSchema.virtual("avatarUrl").get(function onAvatarUrl(): void {
      // @ts-ignore
      let url = this.avatar || tools.makeGravatar(this.email.toLowerCase());

      // tslint:disable-next-line
      if (url.indexOf("http:") === 0) {
        url = url.slice(5);
      }

      // 如果是 github 的头像，则限制大小
      if (url.indexOf("githubusercontent") !== -1) {
        url += "&s=120";
      }

      return url;
    });

    UserSchema.index({ email: 1 }, { unique: true });
    UserSchema.index({ did: 1 }, { unique: true });

    UserSchema.plugin(baseModel);
    UserSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    UserSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("User", UserSchema);
  }

  public async getById(id: string): Promise<TUser | null> {
    return this.Model.findOne({ _id: id });
  }

  public async getByDid(did: string): Promise<TUser | null> {
    return this.Model.findOne({ did });
  }

  public async getByMail(email: string): Promise<TUser | null> {
    return this.Model.findOne({ email });
  }

  public async newAndSave(user: TNewUser): Promise<TUser | null> {
    const hashed = {
      ...user,
      password: await tools.bhash(user.password)
    };
    return new this.Model(hashed).save();
  }

  async newAndSaveDidUser(user: TDidUser): Promise<TUser | null> {
    return new this.Model({
      ...user
    }).save();
  }

  public async updateAssocProfileId(
    userId: string,
    lifetimeHumanId: string
  ): Promise<TUserDoc> {
    return this.Model.update({ _id: userId }, { lifetimeHumanId });
  }

  public async updatePassword(
    userId: string,
    password: string
  ): Promise<TUserDoc | null> {
    return this.Model.update(
      { _id: userId },
      { password: await tools.bhash(password) }
    );
  }

  public async verifyPassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    let resp;
    try {
      resp = await this.Model.findOne({ _id: userId }).select("password");
    } catch (err) {
      return false;
    }
    return Boolean(resp && (await tools.bcompare(password, resp.password)));
  }

  public async deleteById(id: string): Promise<boolean> {
    const resp = await this.Model.deleteOne({ _id: id });
    return Boolean(resp && resp.ok);
  }

  public async updatePrivateKeyCipher(
    userId: string,
    privateKeyCipher: string
  ): Promise<void> {
    await this.Model.findOneAndUpdate({ _id: userId }, { privateKeyCipher });
  }

  public async getPrivateKeyCipher(
    userId: string
  ): Promise<string | undefined | null> {
    const resp = await this.Model.findOne({ _id: userId }).select(
      "privateKeyCipher"
    );
    return resp && resp.privateKeyCipher;
  }
}
