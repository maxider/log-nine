import { PayloadAction, createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Task, TaskStatus } from "../types/Task";
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

export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (task: Task) => {
    const response = await axios.post(
      `${BACKEND_URL}/Tasks/CreateTask`,
      task
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
  reducers: {
    addTasks(state, action: PayloadAction<Task[]>) {
      action.payload.forEach((t) => {
        state.tasks[t.id] = t;
      });
    },
    // incrementStatus(state, action: PayloadAction<number>) {
    //   const curStatus = state.tasks[action.payload]?.status;
    //   if (curStatus === undefined) return;
    //   state.tasks[action.payload].status = Math.min(5, curStatus + 1);
    // },
    decrementStatus(state, action: PayloadAction<number>) {
      const curStatus = state.tasks[action.payload]?.status;
      if (!curStatus) return;
      state.tasks[action.payload].status = Math.max(0, curStatus - 1);
    },
  },
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
      console.log(action.payload);
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
  },
});

export const { addTasks } = taskSlice.actions;

export default taskSlice.reducer;
