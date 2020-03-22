import test from "ava";
import { createHmacs, getHmac, tokenize } from "../get-hmac";

const PRIVATE_KEY =
  "b24dee718ec99e1616a9a35c440ab3663a6f6259e3648ff0362cdea8f5afd5eb";

test("get hmac", async t => {
  t.deepEqual(
    getHmac("强", PRIVATE_KEY),
    "LtfmFuvJAz13RAeiLrQH6xIeJFw+tRNDPx/hvCcq7HM="
  );
  t.deepEqual(
    getHmac("Yun", PRIVATE_KEY),
    "IiAcFR+K4wk08626+GvsZty+Y6tsArf3H8cXKteAaeI="
  );
  t.deepEqual(
    getHmac("yun", PRIVATE_KEY),
    "IiAcFR+K4wk08626+GvsZty+Y6tsArf3H8cXKteAaeI="
  );
});

test("tokenize", async t => {
  t.deepEqual(tokenize("Yan Li 李岩"), ["Yan", "Li", "李", "岩"]);
  t.deepEqual(tokenize("Yan Li"), ["Yan", "Li"]);
  t.deepEqual(tokenize("李岩"), ["李", "岩"]);
  // TODO(tian): how to fix this?
  t.deepEqual(tokenize("Yan Li李岩"), ["Yan", "Li李岩"]);
});

test("createHmacs", async t => {
  t.deepEqual(createHmacs("Yan Li 李岩", PRIVATE_KEY), [
    "XCEdXPume35qQGbtxuZVVfceBswJfjDBWf6obQW6VHQ=",
    "Dc+Xg5omXCuTPb54CJxix2QD49BBnl6eugUtTNlFAqM=",
    "Eydum8c6ud3KwSUeEk1Gt4zONQEUDl6mjdxX/hg9Fks=",
    "BPCEwtcQOdvserO9cani8CNWgIjMG23pzZFXP7MFIEI="
  ]);
  t.deepEqual(createHmacs("yan Li", PRIVATE_KEY), [
    "XCEdXPume35qQGbtxuZVVfceBswJfjDBWf6obQW6VHQ=",
    "Dc+Xg5omXCuTPb54CJxix2QD49BBnl6eugUtTNlFAqM="
  ]);
  t.deepEqual(createHmacs("李岩", PRIVATE_KEY), [
    "Eydum8c6ud3KwSUeEk1Gt4zONQEUDl6mjdxX/hg9Fks=",
    "BPCEwtcQOdvserO9cani8CNWgIjMG23pzZFXP7MFIEI="
  ]);
  // TODO(tian): how to fix this?
  t.deepEqual(createHmacs("Yan Li李岩", PRIVATE_KEY), [
    "XCEdXPume35qQGbtxuZVVfceBswJfjDBWf6obQW6VHQ=",
    "f6k7Z/YSLV7SzpDmlOPZ93apuhkjdTu+uQNGXmyMRdA="
  ]);
});
