import blockstack from "blockstack";
import { SECP256K1Client } from "jsontokens";
import { PRIVATE_KEY_LOCAL } from "../onefx-auth-provider/email-password-identity-provider/view/post-auth-local";

export function getLocalKeyPair(): { privateKey: string; publicKey: string } {
  try {
    let privateKey = localStorage.getItem(PRIVATE_KEY_LOCAL);
    if (privateKey) {
      const publicKey = SECP256K1Client.derivePublicKey(privateKey);

      return {
        privateKey,
        publicKey
      };
    }

    const userData = blockstack.loadUserData();
    privateKey = userData.appPrivateKey;
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
