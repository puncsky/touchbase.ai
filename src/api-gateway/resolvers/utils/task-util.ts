import { rrulestr } from "rrule";
import { TTask } from "../../../types/task";

const EARLEST = new Date(-8640000000000000);

export function populateTask(task: TTask | null): TTask | null {
  if (!task) {
    return null;
  }

  if (task.rrule) {
    const rr = rrulestr(task.rrule);
    const doneDate = task.done ? rr.after(task.done) : EARLEST;
    const delayedDate = task.delayed ? rr.after(task.delayed) : EARLEST;
    const max = doneDate > delayedDate ? doneDate : delayedDate;
    const dsDue = rr.all((_, i) => {
      return i < 1;
    })[0];
    task.due = dsDue > max ? dsDue : max;
  }
  return task;
}
