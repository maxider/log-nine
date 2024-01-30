import axios from "axios";
import { Team } from "../types/Task";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (thunkApi) => {
    const response = await axios.get("https://localhost:7060/Board/1/teams");
    return response.data;
  }
);

export const addNewTeam = createAsyncThunk(
  "teams/addNewTeam",
  async (team: Team) => {
    const response = await axios.post(
      "https://localhost:7060/Team/CreateTeam",
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
    builder.addCase(fetchTeams.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      state.status = "succeded";
      action.payload.forEach((t: Team) => {
        state.teams[t.id] = t;
      });
    });
    builder.addCase(fetchTeams.rejected, (state, action) => {
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