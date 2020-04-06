import { logger } from "onefx/lib/integrated-gateways/logger";
import webpush, { SendResult } from "web-push";

type Opts = {
  gcmApiKey: string;
  mailto: string;
  publicKey: string;
  privateKey: string;
};

export class WebPush {
  constructor(opts: Opts) {
    webpush.setGCMAPIKey(opts.gcmApiKey);
    if (opts.privateKey) {
      webpush.setVapidDetails(opts.mailto, opts.publicKey, opts.privateKey);
    } else {
      logger.warn(`please specify WEB_PUSH_PRIVATE_KEY`);
    }
  }

  static async init(): Promise<void> {
    const vapidKeys = webpush.generateVAPIDKeys();
    logger.debug(JSON.stringify(vapidKeys));
  }

  async pushMessage(
    token: string,
    msg: { text: string; body: string; url: string }
  ): Promise<SendResult> {
    return webpush.sendNotification(JSON.parse(token), JSON.stringify(msg));
  }
}
