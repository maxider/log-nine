import Team from "../entities/Team";

export function fetchTeams(boardId: string) {
  return () =>
    fetch(`http://localhost:5174/Boards/${boardId}/teams`)
      .then((res) => res.json())
      .then((data) => {
        const teams: Team[] = data.map((team: Team) => ({
          id: team.id,
          boardId: team.boardId,
          name: team.name,
          srFrequency: team.srFrequency,
          lrFrequency: team.lrFrequency,
        }));

        return teams;
      });
}
