import { Trupp } from "../Trupp";
import { Worker } from "./Worker";

export enum Priority {
  Urgent=1,
  Low=0,
}

export type Task = {
  id: number;
  visualId: number;
  boardId: number;
  title: string;
  description: string;
  workers: Worker[];
  target: Trupp;
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