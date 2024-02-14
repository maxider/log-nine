import { Priority } from "./types/Task";

export function prioToColor(prio: Priority): string {
  switch (prio) {
    case Priority.Low:
      return "bg-sky-900";
    case Priority.Normal:
      return "";
    case Priority.Urgent:
      return "bg-red-900";
  }
}
