namespace Tests.Mocks;

public class MockTeamRepository : BaseTestRepository, ITeamRepository {
    public ValueTask<Team?> GetTeamByIdAsync(int id) {
        return new ValueTask<Team?>(Teams.TryGetValue(id, out var team) ? team : null);
    }

    public IEnumerable<Team> GetTeamsByIds(IEnumerable<int> ids) {
        return Teams.Values.Where(t => ids.Contains(t.Id));
    }

    public Task<List<Team>> GetAllTeamsAsync() {
        return Task.FromResult(Teams.Values.ToList());
    }

    public Task<Team> CreateTeamAsync(TeamCreationParams team) {

        if (!Boards.TryGetValue(team.BoardId, out _))
        {
            throw new BoardNotFoundException(team.BoardId);
        }

        var newTeam = new Team{
            Id = Teams.Count + 1,
            Name = team.Name,
            BoardId = team.BoardId,
            LrFrequency = team.LrFrequency,
            SrFrequency = team.SrFrequency
        };
        Teams.Add(newTeam.Id, newTeam);
        return Task.FromResult(newTeam);
    }

    public Task<Team> UpdateTeamAsync(int id, TeamCreationParams team) {
        if (!Teams.TryGetValue(id, out var existingTeam))
        {
            throw new TeamNotFoundException(id);
        }

        if (!Boards.TryGetValue(team.BoardId, out _))
        {
            throw new BoardNotFoundException(team.BoardId);
        }

        existingTeam.Name = team.Name;
        existingTeam.BoardId = team.BoardId;
        existingTeam.LrFrequency = team.LrFrequency;
        existingTeam.SrFrequency = team.SrFrequency;
        return Task.FromResult(existingTeam);
    }

    public Task<Team?> DeleteTeamAsync(int id) {
        if (!Teams.TryGetValue(id, out var team))
        {
            return Task.FromResult<Team?>(null);
        }

        Teams.Remove(id);
        return Task.FromResult<Team?>(team);
    }
}