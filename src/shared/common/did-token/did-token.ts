import { getPublicKeyFromPrivate } from "blockstack";
import crypto from "crypto";
import { TokenSigner } from "jsontokens/lib/signer";

export const CHALLENGE_TEXT = "touchbase-be-a-super-connector";

export function createDidToken(signerKeyHex: string): string {
  const FIVE_MIN_SECONDS = 60 * 5;
  const salt = crypto.randomBytes(16).toString("hex");
  const iss = getPublicKeyFromPrivate(signerKeyHex);
  const payload = {
    tbChallenge: CHALLENGE_TEXT,
    exp: FIVE_MIN_SECONDS + Date.now() / 1000,
    iss,
    salt
  };
  return new TokenSigner("ES256K", signerKeyHex).sign(payload);
}
