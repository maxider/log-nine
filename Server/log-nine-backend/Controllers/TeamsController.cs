using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FunWithEF.Controllers;

//Controller similar to tasksController but for teams
[ApiController]
[Route("[controller]")]
public class TeamsController : ControllerBase {
    private readonly ILogger<TeamsController> logger;
    private readonly AppContext context;

    public TeamsController(ILogger<TeamsController> logger, AppContext context) {
        this.logger = logger;
        this.context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var teams = await context.Teams.Select(t => new TeamDTO(t.Id, t.Name, t.BoardId, t.SrFrequency, t.LrFrequency))
            .ToListAsync();
        return Ok(teams);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) {
        var team = await context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }
        return Ok(new TeamDTO(team.Id, team.Name, team.BoardId, team.SrFrequency, team.LrFrequency));
    }

    [HttpPost]
    public async Task<IActionResult> Create(TeamCreationParams team) {
        var newTeam = new Team{
            Name = team.Name, BoardId = team.BoardId, SrFrequency = team.SrFrequency, LrFrequency = team.LrFrequency
        };
        context.Teams.Add(newTeam);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new{ id = newTeam.Id }, newTeam);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TeamCreationParams team) {
        var teamToUpdate = await context.Teams.FindAsync(id);
        if (teamToUpdate == null)
        {
            return NotFound();
        }
        teamToUpdate.Name = team.Name;
        await context.SaveChangesAsync();
        return Ok(new TeamDTO(teamToUpdate.Id, teamToUpdate.Name, teamToUpdate.BoardId, teamToUpdate.SrFrequency,
            teamToUpdate.LrFrequency));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var team = await context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }
        context.Teams.Remove(team);
        await context.SaveChangesAsync();
        return NoContent();
    }
}

public record struct TeamCreationParams(string Name, int BoardId, float SrFrequency, float LrFrequency);