// mongoose plugin http://mongoosejs.com/docs/plugins.html
import mongoose from "mongoose";
import tools from "../utils/tools";

export function baseModel(schema: mongoose.Schema): void {
  schema.methods.createAtAgo = function createAtAgo(): string {
    // @ts-ignore
    return tools.formatDate(this.createAt, true);
  };

  schema.methods.updateAtAgo = function updateAtAgo(): string {
    // @ts-ignore
    return tools.formatDate(this.updateAt, true);
  };
}
