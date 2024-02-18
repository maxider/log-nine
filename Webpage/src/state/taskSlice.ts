import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Priority, Task, TaskStatus } from "../types/Task";
import axios from "axios";
import { BACKEND_URL } from "../config";

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

export const fetchTasksByBoardId = createAsyncThunk(
  "tasks/fetchTasksByBoardId",
  async (boardId: number, thunkApi) => {
    const response = await axios.get(`${BACKEND_URL}/Boards/${boardId}/tasks`);
    return response.data;
  }
);

export type TaskCreationParams = {
  boardId: number;
  title: string;
  description: string;
  targetId?: number;
  status: TaskStatus;
  priority: Priority;
  taskType: 0;
};

export type TaskEditParams = { id: number; creationParams: TaskCreationParams };

export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (creationParams: TaskCreationParams) => {
    const response = await axios.post(`${BACKEND_URL}/Tasks`, creationParams);
    return response.data;
  }
);

export const EditTask = createAsyncThunk(
  "tasks/editTask",
  async (params: TaskEditParams) => {
    const response = await axios.put(
      `${BACKEND_URL}/Tasks/${params.id}`,
      params.creationParams
    );
    return response.data;
  }
);

export const incrementStatus = createAsyncThunk(
  "tasks/increment",
  async (taskId: number) => {
    const response = await axios.patch(
      `${BACKEND_URL}/Tasks/${taskId}/increment`
    );
    return response.data;
  }
);

export const decrementStatus = createAsyncThunk(
  "tasks/decrement",
  async (taskId: number) => {
    const response = await axios.patch(
      `${BACKEND_URL}/Tasks/${taskId}/decrement`
    );
    return response.data;
  }
);

const taskSlice = createSlice({
  initialState: initialState,
  name: "task",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasksByBoardId.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasksByBoardId.fulfilled, (state, action) => {
      state.status = "succeded";
      action.payload.forEach((t: Task) => {
        state.tasks[t.id] = t;
      });
    });
    builder.addCase(fetchTasksByBoardId.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(incrementStatus.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(incrementStatus.fulfilled, (state, action) => {
      state.tasks[action.payload.id].status = action.payload.status;
    });

    builder.addCase(decrementStatus.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(decrementStatus.fulfilled, (state, action) => {
      state.tasks[action.payload.id].status = action.payload.status;
    });

    builder.addCase(addNewTask.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      state.tasks[action.payload.id] = action.payload;
    });

    builder.addCase(EditTask.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(EditTask.fulfilled, (state, action) => {
      state.tasks[action.payload.id] = action.payload;
    });
  },
});

export default taskSlice.reducer;
