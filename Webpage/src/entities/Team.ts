type Team = {
  id: number;
  boardId: number;
  name: string;
  srFrequency: number;
  lrFrequency: number;
};

export const UndefinedTeam: Team = {
  id: -1,
  boardId: -1,
  name: "Undefined",
  srFrequency: -1,
  lrFrequency: -1,
};

export default Team;
