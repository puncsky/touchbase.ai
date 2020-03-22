import * as crypto from "crypto";

export function tokenize(name: string): Array<string> {
  if (!name) {
    return [];
  }

  return name.match(/[\u00ff-\uffff]|\S+/g) || [];
}

export function getHmac(hmacPayload: string, macKey: string): string {
  const lower = String(hmacPayload).toLowerCase();
  const hmac = crypto.createHmac("sha256", macKey);
  hmac.write(lower);
  const hmacDigest = hmac.digest();
  return hmacDigest.toString("base64");
}

export function createHmacs(name: string, macKey: string): Array<string> {
  const tokens = tokenize(name);
  return tokens.map(t => getHmac(t, macKey));
}
