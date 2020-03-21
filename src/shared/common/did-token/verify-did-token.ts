import { decodeToken, TokenVerifier } from "jsontokens";
import { CHALLENGE_TEXT } from "./did-token";

export function verifyDidToken(did: string): Record<any, any> {
  const payload = getTokenPayload(decodeToken(did));
  const publicKey = payload.iss;
  if (!publicKey) {
    throw new Error("Auth token should be a JWT with at least an `iss` claim");
  }
  const challenge = payload.tbChallenge;
  if (challenge !== CHALLENGE_TEXT) {
    throw new Error("challenge text is incorrect");
  }
  const verified = new TokenVerifier("ES256K", publicKey).verify(did);
  if (!verified) {
    throw new Error("Failed to verify association JWT: invalid issuer");
  }
  const expiresAt = payload.exp;
  if (expiresAt && expiresAt < Date.now() / 1000) {
    throw new Error(
      `Expired authentication token: expire time of ${expiresAt} (secs since epoch)`
    );
  }
  return payload;
}

function getTokenPayload(
  token: import("jsontokens/lib/decode").TokenInterface
): Record<any, any> {
  if (typeof token.payload === "string") {
    throw new Error("Unexpected token payload type of string");
  }
  return token.payload;
}
