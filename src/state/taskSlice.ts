import { PayloadAction, createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Task, TaskStatus } from "../types/Task";
import axios from "axios";
import { RootState } from "./store";

interface TaskState {
  tasks: Record<number, Task>;
  status: "idle" | "loading" | "succeded" | "failed";
  error: string | undefined;
}

const initialState: TaskState = {
  tasks: {},
  status: "idle",
  error: undefined,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (thunkApi) => {
    const response = await axios.get("https://localhost:7060/Board/1/tasks");
    return response.data;
  }
);

export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (task: Task) => {
    const response = await axios.post(
      "https://localhost:7060/Task/CreateTask",
      task
    );
    return response.data;
  }
);

const taskSlice = createSlice({
  initialState: initialState,
  name: "task",
  reducers: {
    addTasks(state, action: PayloadAction<Task[]>) {
      action.payload.forEach((t) => {
        state.tasks[t.id] = t;
      });
    },
    incrementStatus(state, action: PayloadAction<number>) {
      const curStatus = state.tasks[action.payload]?.status;
      if (curStatus === undefined) return;
      state.tasks[action.payload].status = Math.min(3, curStatus + 1);
    },
    decrementStatus(state, action: PayloadAction<number>) {
      const curStatus = state.tasks[action.payload]?.status;
      if (!curStatus) return;
      state.tasks[action.payload].status = Math.max(0, curStatus - 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.status = "succeded";
      action.payload.forEach((t: Task) => {
        state.tasks[t.id] = t;
      });
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(addNewTask.pending, (state, action) => {
        state.status = "loading";
    });
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      state.tasks[action.payload.id] = action.payload;
    });
  },
});

export const { addTasks, incrementStatus, decrementStatus } = taskSlice.actions;

export default taskSlice.reducer;
