import axios from "axios";
import { logger } from "onefx/lib/integrated-gateways/logger";
import { TFullContact } from "../../types/full-contact";

type GetPersonOpts = {
  email: string;
  emailHash: string;
  twitter: string;
  phone: string;
};

export class Fullcontact {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPerson({
    email,
    emailHash,
    twitter,
    phone
  }: GetPersonOpts): Promise<TFullContact | null> {
    try {
      const resp = await axios.post(
        "https://api.fullcontact.com/v3/person.enrich",
        {
          email,
          emailHash,
          twitter,
          phone
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`
          }
        }
      );
      return resp.data;
    } catch (e) {
      if (e.response.status !== 404) {
        logger.error(`failed to getPerson: ${e.response.message}`);
      }
      return null;
    }
  }
}
