type Task = {
  id: number;
  visualId: number;
  boardId: number;
  targetId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export enum TaskStatus {
  TODO = 0,
  EN_ROUTE = 1,
  ON_SITE = 2,
  RETURNING = 3,
  DONE = 4,
  CANCELLED = 5,
}

export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

export const UndefinedTask = {
  id: -1,
  visualId: -1,
  boardId: -1,
  targetId: -1,
  title: "Undefined",
  description: "Undefined",
  status: TaskStatus.TODO,
  priority: TaskPriority.LOW,
};

export default Task;
