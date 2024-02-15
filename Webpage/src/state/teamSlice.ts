import axios from "axios";
import { Team } from "../types/Task";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";

interface TeamState {
  teams: Record<number, Team>;
  status: "idle" | "loading" | "succeded" | "failed";
  error: string | undefined;
}

const initialState: TeamState = {
  teams: {},
  status: "idle",
  error: undefined,
};

export const fetchTeamsByBoardId = createAsyncThunk(
  "tasks/fetchTeamsByBoardId",
  async (boardId: number, thunkApi) => {
    const response = await axios.get(
      `${BACKEND_URL}/Boards/${boardId}/teams`
    );
    return response.data;
  }
);

export const addNewTeam = createAsyncThunk(
  "teams/addNewTeam",
  async (team: Team) => {
    const response = await axios.post(
      `${BACKEND_URL}/Teams/CreateTeam`,
      team
    );
    return response.data;
  }
);

const teamSlice = createSlice({
  initialState: initialState,
  name: "team",
  reducers: {
    addTeams(state, action: PayloadAction<Team[]>) {
      action.payload.forEach((t) => {
        state.teams[t.id] = t;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTeamsByBoardId.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchTeamsByBoardId.fulfilled, (state, action) => {
      state.status = "succeded";
      action.payload.forEach((t: Team) => {
        state.teams[t.id] = t;
      });
    });
    builder.addCase(fetchTeamsByBoardId.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
    builder.addCase(addNewTeam.fulfilled, (state, action) => {
      state.teams[action.payload.id] = action.payload;
    });
  },
});

export const { addTeams } = teamSlice.actions;

export default teamSlice.reducer;
