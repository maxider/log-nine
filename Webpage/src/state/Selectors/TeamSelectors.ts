import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectTeamsMap = (state: RootState) => state.teams.teams;
const selectTeamsId = (state: RootState, id: number) => id;
const selectTaskBoardId = (state: RootState, boardId: number) => boardId;

export const selectTeams = createSelector(
  [(state: RootState) => state.teams],
  (teams) => Object.values(teams.teams)
);

export const selectTeamsByBoardId = createSelector(
  [selectTeams, selectTaskBoardId],
  (teams, boardId) => teams.filter((t) => t.boardId === boardId)
);

export const selectTeamById = createSelector(
  [selectTeamsMap, selectTeamsId],
  (teams, id) => teams[id]
);
