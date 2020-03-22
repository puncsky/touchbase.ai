import blockstack from "blockstack";
import { SECP256K1Client } from "jsontokens";

export function getLocalKeyPair(): { privateKey: string; publicKey: string } {
  try {
    const userData = blockstack.loadUserData();
    const privateKey = userData.appPrivateKey;
    const publicKey = SECP256K1Client.derivePublicKey(privateKey);

    return {
      privateKey: userData.appPrivateKey,
      publicKey
    };
  } catch (e) {
    return {
      privateKey: "",
      publicKey: ""
    };
  }
}
