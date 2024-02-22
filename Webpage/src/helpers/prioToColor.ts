import { TaskPriority } from "../entities/Task";

export const priorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return "#082f49";
      case TaskPriority.MEDIUM:
        return "";
      case TaskPriority.HIGH:
        return "#7f1d1d";
    }
  };