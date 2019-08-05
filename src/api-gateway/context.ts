/* tslint:disable:no-any */
import { Model } from "../model/model";
import { Gateways } from "../server/gateway/gateway";
import { OnefxAuth } from "../shared/onefx-auth";

export interface IContext {
  userId: string;
  session: any;
  model: Model;
  gateways: Gateways;
  auth: OnefxAuth;
}
