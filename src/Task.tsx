import { Worker, Trupp } from "./App";

export enum Priority {
  Urgent=1,
  Low=0,
}

export type Task = {
  id: number;
  titel: string;
  description: string;
  workers: Worker[];
  target: Trupp;
  status: TaskStatus;
  priority?: Priority;
};

export enum TaskStatus {
  Todo,
  EnRoute,
  OnSite,
  Returning,
  Done,
  Canceled,
}