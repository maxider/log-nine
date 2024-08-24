import axios from "axios";
import Task from "../entities/Task";
import backendUrl from "./BackendUrl";

export const incrementPriority = (task: Task) => {
  const params = {
    boardId: task.boardId,
    title: task.title,
    description: task.description,
    targetId: task.targetId,
    priority: Math.min(task.priority + 1, 2),
    status: task.status,
    taskType: 0,
    visualId: task.visualId,
  };

  if (params.priority === task.priority) return Promise.resolve();

  return axios
    .put(`${backendUrl}/Tasks/${task.id}`, params)
    .then(() => Promise.resolve());
};

export const decrementPriority = (task: Task) => {
  const params = {
    boardId: task.boardId,
    title: task.title,
    description: task.description,
    targetId: task.targetId,
    priority: Math.max(task.priority - 1, 0),
    status: task.status,
    taskType: 0,
    visualId: task.visualId,
  };

  if (params.priority === task.priority) return Promise.resolve();

  return axios
    .put(`${backendUrl}/Tasks/${task.id}`, params)
    .then(() => Promise.resolve());
};

export const incrementStatus = (task: Task) => {
  const params = {
    boardId: task.boardId,
    title: task.title,
    description: task.description,
    targetId: task.targetId,
    priority: task.priority,
    status: Math.min(task.status + 1, 5),
    taskType: 0,
    visualId: task.visualId,
  };

  if (params.status === task.status) return Promise.resolve();

  return axios
    .put(`${backendUrl}/Tasks/${task.id}`, params)
    .then(() => Promise.resolve());
};

export const decrementStatus = (task: Task) => {
  const params = {
    boardId: task.boardId,
    title: task.title,
    description: task.description,
    targetId: task.targetId,
    priority: task.priority,
    status: Math.max(task.status - 1, 0),
    taskType: 0,
    visualId: task.visualId,
  };

  if (params.status === task.status) return Promise.resolve();

  return axios
    .put(`${backendUrl}/Tasks/${task.id}`, params)
    .then(() => Promise.resolve());
};

export interface UpdateTaskParams {
  id: number;
  params: {
    boardId: number;
    title: string;
    description: string;
    targetId: number;
    priority: number;
    status: number;
    taskType: number;
    visualId: number;
    assignedToId?: number;
  };
}

export const updateTaskFn = (params: UpdateTaskParams) => {
  return axios
    .put(`${backendUrl}/Tasks/${params.id}`, params.params)
    .then(() => {
      console.log("Task updated:", params.params);
      Promise.resolve();
    });
};

export interface UpdateTeamParams {
  id: number;
  params: {
    name: string;
    boardId: number;
    srFrequency: number;
    lrFrequency: number;
  };
}

export const updateTeamFn = (params: UpdateTeamParams) => {
  return axios
    .put(`${backendUrl}/Teams/${params.id}`, params.params)
    .then(() => Promise.resolve());
};

export interface CreateTeamParams {
  name: string;
  boardId: number;
  srFrequency: number;
  lrFrequency: number;
}

export const createTeamFn = (params: CreateTeamParams) => {
  return axios
    .post(`${backendUrl}/Teams`, params)
    .then(() => Promise.resolve());
};

export const cancleTaskFn = (task: Task) => {
  const params: UpdateTaskParams = {
    id: task.id,
    params: {
      boardId: task.boardId,
      title: task.title,
      description: task.description,
      targetId: task.targetId,
      priority: task.priority,
      status: 5,
      taskType: 0,
      visualId: task.visualId,
    }
  };

  return updateTaskFn(params)
}