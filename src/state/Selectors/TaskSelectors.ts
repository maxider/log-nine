import { createSelector } from "@reduxjs/toolkit";
import { TaskStatus } from "../../types/Task";
import { RootState } from "../store";

const selectTasksMap = (state: RootState) => state.tasks.tasks;
const selectTasksId = (state: RootState, id: number) => id;
const selectTaskStatus = (state: RootState, status: TaskStatus) => status;
const selectTaskBoardId = (state: RootState, boardId: number) => boardId;

export const selectTasks = createSelector(
  [(state: RootState) => state.tasks],
  (tasks) => Object.values(tasks.tasks)
);

export const selectTasksByBoardId = createSelector(
  [selectTasks, selectTaskBoardId],
  (tasks, boardId) => tasks.filter((t) => t.boardId === boardId)
);

export const selectTaskById = createSelector(
  [selectTasksMap, selectTasksId],
  (tasks, id) => tasks[id]
);

export const selectTaskByStatus = createSelector(
  [selectTasks, selectTaskStatus],
  (tasks, status) => tasks.filter((t) => t.status === status)
);
