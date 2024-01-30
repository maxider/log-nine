import { Worker } from "./Worker";

export enum Priority {
  Low=0,
  Normal=1,
  Urgent=2,
}

export type Task = {
  id: number;
  visualId: number;
  boardId: number;
  title: string;
  description: string;
  workers: Worker[];
  targetId?: number;
  status: TaskStatus;
  priority: Priority;
};

export enum TaskStatus {
  Todo,
  EnRoute,
  OnSite,
  Returning,
  Done,
  Canceled,
}

export type Team = {
  id: number;
  boardId: number;
  name: string;
  freqSr: number;
  freqLr: number;
}