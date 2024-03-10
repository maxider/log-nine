using LogNineBackend.Controllers;
using LogNineBackend.Exceptions;
using LogNineBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Repositories;

public class TeamRepository : ITeamRepository {
    private readonly AppContext context;

    public TeamRepository(AppContext context) {
        this.context = context;
    }

    public ValueTask<Team?> GetTeamByIdAsync(int id) {
        return context.Teams.FindAsync(id);
    }

    public IEnumerable<Team> GetTeamsByIds(IEnumerable<int> ids) {
        return context.Teams.Where(t => ids.Contains(t.Id));
    }

    public Task<List<Team>> GetAllTeamsAsync() {
        return context.Teams.ToListAsync();
    }

    public async Task<Team> CreateTeamAsync(TeamCreationParams team) {
        await using var transaction = await context.Database.BeginTransactionAsync();

        await CheckForeignKeyConstraints(team);

        var newTeam = new Team{
            Name = team.Name, BoardId = team.BoardId, SrFrequency = team.SrFrequency, LrFrequency = team.LrFrequency
        };
        context.Teams.Add(newTeam);
        await context.SaveChangesAsync();
        await transaction.CommitAsync();

        return newTeam;
    }

    public async Task<Team> UpdateTeamAsync(int id, TeamCreationParams team) {
        var teamToUpdate = await context.Teams.FindAsync(id);

        if (teamToUpdate == null)
        {
            throw new TeamNotFoundException(id);
        }

        await CheckForeignKeyConstraints(team);

        teamToUpdate.Name = team.Name;
        teamToUpdate.BoardId = team.BoardId;
        teamToUpdate.SrFrequency = team.SrFrequency;
        teamToUpdate.LrFrequency = team.LrFrequency;
        await context.SaveChangesAsync();

        return teamToUpdate;
    }

    public async Task<Team?> DeleteTeamAsync(int id) {
        var team = await context.Teams.FindAsync(id);
        if (team == null)
        {
            return null;
        }
        context.Teams.Remove(team);
        await context.SaveChangesAsync();
        return team;
    }

    private async Task CheckForeignKeyConstraints(TeamCreationParams team) {
        var board = await context.Boards.FindAsync(team.BoardId);
        if (board == null)
        {
            throw new BoardNotFoundException(team.BoardId);
        }
    }
}