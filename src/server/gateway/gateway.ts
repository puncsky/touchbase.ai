import config from "config";
import mongoose from "mongoose";
import { MyServer } from "../start-server";
import { Fullcontact } from "./fullcontact";
import { WebPush } from "./web-push";

export type Gateways = {
  mongoose: mongoose.Mongoose;
  fullcontact: Fullcontact;
  webPush: WebPush;
};

export async function setGateways(server: MyServer): Promise<void> {
  server.gateways = server.gateways || {};

  if (!server.config.gateways.mongoose.uri) {
    server.logger.warn(
      "cannot connect to the database without gateways.mongoose.uri provided in configuration"
    );
  } else {
    mongoose
      .connect(server.config.gateways.mongoose.uri, { useNewUrlParser: true })
      .catch(err => {
        server.logger.warn(`failed to connect mongoose: ${err}`);
      });
  }
  server.gateways.mongoose = mongoose;
  server.gateways.fullcontact = new Fullcontact(
    config.get("gateways.fullContactApiKey")
  );

  server.gateways.webPush = new WebPush(config.get("gateways.webPush"));
}
