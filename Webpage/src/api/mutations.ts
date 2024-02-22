import axios from "axios";
import Task from "../entities/Task";

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
    .put(`http://localhost:5174/Tasks/${task.id}`, params)
    .then(() => {
      return Promise.resolve();
    });
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
    .put(`http://localhost:5174/Tasks/${task.id}`, params)
    .then(() => {
      return Promise.resolve();
    });
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
    .put(`http://localhost:5174/Tasks/${task.id}`, params)
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
    .put(`http://localhost:5174/Tasks/${task.id}`, params)
    .then(() => Promise.resolve());
};
