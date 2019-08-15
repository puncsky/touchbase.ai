import test from "ava";
import { monthDiff } from "../key-metrics";

test("month diff", async t => {
  const mdiff = monthDiff(
    new Date("2018-12-12T08:00:36.591Z"),
    new Date("2018-12-13T08:00:36.591Z")
  );
  t.deepEqual(mdiff, 0);
});
