import { Worker, Trupp } from "./App";

export type Task = {
  id: number;
  titel: string;
  description: string;
  workers: Worker[];
  target: Trupp;
  status: TaskStatus;
};

export enum TaskStatus {
  Todo,
  EnRoute,
  OnSite,
  Returning,
  Done,
  Canceled,
}