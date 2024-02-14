// import { TaskStatus, Team } from "../types/Task";
// import {
//   PayloadAction,
//   configureStore,
//   createSelector,
//   createSlice,
// } from "@reduxjs/toolkit";
// import { Task } from "../types/Task";

// type State = Readonly<{
//   tasks: Record<number, Task>;
//   teams: Record<number, Team>;
// }>;

// const initialState: State = {
//   tasks: {},
//   teams: {},
// };

// const slice = createSlice({
//   initialState: initialState,
//   name: "slice",
//   reducers: {
//     addTasks(state, action: PayloadAction<Task[]>) {
//       action.payload.forEach((t) => {
//         state.tasks[t.id] = t;
//       });
//     },
//     addTeams(state, action: PayloadAction<Team[]>) {
//       action.payload.forEach((t) => {
//         state.teams[t.id] = t;
//       });
//     },
//     incrementStatus(state, action: PayloadAction<number>) {
//       const curStatus = state.tasks[action.payload]?.status;
//       if (curStatus === undefined) return;
//       state.tasks[action.payload].status = Math.min(3, curStatus + 1);
//     },
//     decrementStatus(state, action: PayloadAction<number>) {
//       const curStatus = state.tasks[action.payload]?.status;

//       if (!curStatus) return;

//       state.tasks[action.payload].status = Math.max(0, curStatus - 1);
//     },
//   },
// });

// export const { addTasks, addTeams, incrementStatus, decrementStatus } =
//   slice.actions;

// export const store = configureStore({
//   reducer: {
//     main: slice.reducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatcher = typeof store.dispatch;

// const selectTasksId = (state: RootState, id: number) => id;
// const selectTaskStatus = (state: RootState, status: TaskStatus) => status;
// export const selectTasksRecord = (state: RootState) => state.main.tasks;

// export const selectTasks = createSelector(
//   [(state: RootState) => state.main],
//   (tasks) => Object.values(tasks.tasks)
// );

// export const selectTaskById = createSelector(
//   [selectTasksRecord, selectTasksId],
//   (tasks, id) => tasks[id]
// );

// export const selectTaskByStatus = createSelector(
//   [selectTasks, selectTaskStatus],
//   (tasks, status) => tasks.filter((t) => t.status === status)
// );

export {};