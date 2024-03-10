using LogNineBackend.Controllers;
using LogNineBackend.Models;

namespace LogNineBackend.Repositories;

public interface ITeamRepository {
    ValueTask<Team?> GetTeamByIdAsync(int id);
    IEnumerable<Team> GetTeamsByIds(IEnumerable<int> ids);
    Task<List<Team>> GetAllTeamsAsync();
    Task<Team> CreateTeamAsync(TeamCreationParams team);
    Task<Team> UpdateTeamAsync(int id, TeamCreationParams team);
    Task<Team?> DeleteTeamAsync(int id);
}