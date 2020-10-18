import test from "ava";
import { populateTask } from "../task-util";

test("populateTask", async t => {
  const task = populateTask({
    id: "4e816c2ad0b191229e03670f",
    ownerId: "4e816c2ad0b191229e03670f",
    title: "reminder",
    rrule: "DTSTART:20200329T003400Z\nFREQ=WEEKLY;BYDAY=SU;INTERVAL=1",
    contacts: ["3e7d738c1c0d261142ad738a"]
  });

  t.truthy(task!.due);
});
