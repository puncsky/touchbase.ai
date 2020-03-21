import test from "ava";
import { createDidToken } from "../did-token";
import { verifyDidToken } from "../verify-did-token";

test("create and verify", async t => {
  const didToken = createDidToken(
    "b24dee718ec99e1616a9a35c440ab3663a6f6259e3648ff0362cdea8f5afd5eb"
  );
  t.truthy(didToken);
  const payload = verifyDidToken(didToken);
  t.truthy(payload);
});

test("invalid token", async t => {
  t.throws(() => {
    verifyDidToken(
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJ0YkNoYWxsZW5nZSI6InRvdWNoYmFzZS1iZS1hLXN1cGVyLWNvbm5lY3RvciIsImlzcyI6IjAzMTJjNjI2NGIyNGJmMzllN2Y3NDEyZTBkZTMzMmZmN2JiNjg2YTIzODdhOTA3MjhlZWFmYjFmNDYxZTcwMjI0OCIsInNhbHQiOiJhZWY0MjA2N2Q4Y2UyOWJjMTg3ODAxNzJlZDc1OWVlOSJ9.1902wiHc4MvXfW1ARK8Cy6gMDnslFKhI0JdGczePwfz4f-ca8yyMy2kZNFsyf2fvqWzm73YjtfgTYIwHEFrAaA"
    );
  }, "Failed to verify association JWT: invalid issuer");
});
