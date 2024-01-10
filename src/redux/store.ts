import { TaskStatus } from "./../Task";
import {
  PayloadAction,
  configureStore,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Task } from "../Task";

type TasksState = Readonly<{
  tasks: Record<number, Task>;
}>;

const initialState: TasksState = {
  tasks: {},
};

const tasksSlice = createSlice({
  initialState: initialState,
  name: "tasks",
  reducers: {
    addTasks(state, action: PayloadAction<Task[]>) {
      action.payload.forEach((t) => {
        state.tasks[t.id] = t;
      });
    },
  },
});

export const { addTasks } = tasksSlice.actions;

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatcher = typeof store.dispatch;

const selectTasksId = (state: RootState, id: number) => id;
const selectTaskStatus = (state: RootState, status: TaskStatus) => status;
export const selectTasksRecord = (state: RootState) => state.tasks.tasks;

export const selectTasks = createSelector(
  [(state: RootState) => state.tasks],
  (tasks) => Object.values(tasks.tasks)
);

export const selectTaskById = createSelector(
  [selectTasksRecord, selectTasksId],
  (tasks, id) => tasks[id]
);

export const selectTaskByStatus = createSelector(
  [selectTasks, selectTaskStatus],
  (tasks, status) => tasks.filter((t) => t.status === status)
);
