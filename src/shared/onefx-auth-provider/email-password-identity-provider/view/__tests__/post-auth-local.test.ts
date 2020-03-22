import test from "ava";
import { aesDecrypt, aesEncrypt } from "../post-auth-local";

const PRIVATE_KEY =
  "b24dee718ec99e1616a9a35c440ab3663a6f6259e3648ff0362cdea8f5afd5eb";
const PASSWORD = "fooBar123#@$*";

test("encrypt decrypt", async t => {
  const content = aesEncrypt(PASSWORD, PRIVATE_KEY);
  t.deepEqual(aesDecrypt(PASSWORD, content), PRIVATE_KEY);
});
