import { makeECPrivateKey } from "blockstack";
import * as crypto from "crypto";
import { axiosInstance } from "./axios-instance";

export const PRIVATE_KEY_LOCAL = "_touch_base_private_key";

export async function postSignUpLocal(password: string): Promise<void> {
  const privateKey = makeECPrivateKey();
  localStorage.setItem(PRIVATE_KEY_LOCAL, privateKey);
  const privateKeyCipher = aesEncrypt(password, privateKey);
  await axiosInstance.post("/api/private-key-cipher", { privateKeyCipher });
}

export async function postResetPassword(password: string): Promise<void> {
  const privateKey = localStorage.getItem(PRIVATE_KEY_LOCAL);
  if (!privateKey) {
    await postSignUpLocal(password);
    return;
  }
  const privateKeyCipher = aesEncrypt(password, privateKey);
  await axiosInstance.post("/api/private-key-cipher", { privateKeyCipher });
}

export async function postSignInLocal(password: string): Promise<void> {
  const { data } = await axiosInstance.get("/api/private-key-cipher");
  if (!data.privateKeyCipher) {
    await postSignUpLocal(password);
    return;
  }
  const privateKey = aesDecrypt(password, data.privateKeyCipher);
  localStorage.setItem(PRIVATE_KEY_LOCAL, privateKey);
}

export function aesEncrypt(password: string, plainText: string): string {
  const secret = crypto
    .createHash("sha256")
    .update(password)
    .digest()
    .slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipherText = aes256CbcEncrypt(
    iv,
    secret,
    Buffer.from(plainText, "utf8")
  );
  return JSON.stringify({
    iv: iv.toString("hex"),
    cipherText: cipherText.toString("hex")
  });
}

export function aesDecrypt(password: string, content: string): string {
  const secret = crypto
    .createHash("sha256")
    .update(password)
    .digest()
    .slice(0, 32);
  const { iv, cipherText } = JSON.parse(content);
  return aes256CbcDecrypt(
    Buffer.from(iv, "hex"),
    secret,
    Buffer.from(cipherText, "hex")
  ).toString();
}

function aes256CbcEncrypt(iv: Buffer, key: Buffer, plaintext: Buffer): Buffer {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([cipher.update(plaintext), cipher.final()]);
}

function aes256CbcDecrypt(iv: Buffer, key: Buffer, ciphertext: Buffer): Buffer {
  const cipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([cipher.update(ciphertext), cipher.final()]);
}
