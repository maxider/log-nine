using LogNineBackend.Exceptions;
using LogNineBackend.Models;
using LogNineBackend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace LogNineBackend.Controllers;

//Controller similar to tasksController but for teams
[ApiController]
[Route("[controller]")]
public class TeamsController : ControllerBase {
    private readonly ILogger<TeamsController> logger;
    private readonly ITeamRepository repository;
    private readonly ILogNineHub hub;

    public TeamsController(ILogger<TeamsController> logger, ITeamRepository repository, ILogNineHub hub) {
        this.logger = logger;
        this.repository = repository;
        this.hub = hub;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var teams = await repository.GetAllTeamsAsync();
        return Ok(teams);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) {
        var team = await repository.GetTeamByIdAsync(id);
        if (team == null)
        {
            return NotFound();
        }
        return Ok(new TeamDTO(team.Id, team.Name, team.BoardId, team.SrFrequency, team.LrFrequency));
    }

    [HttpPost]
    public async Task<IActionResult> Create(TeamCreationParams teamParams) {
        Team team;
        try
        {
            team = await repository.CreateTeamAsync(teamParams);
        }
        catch (BoardNotFoundException e)
        {
            return BadRequest($"No Board with id {teamParams.BoardId} found");
        }
        await hub.SendCreatedTeamMessage(team.BoardId);
        return CreatedAtAction(nameof(GetById), new{ id = team.Id }, new TeamDTO(team));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TeamCreationParams team) {
        Team teamToUpdate;
        try
        {
            teamToUpdate = await repository.UpdateTeamAsync(id, team);
        }
        catch (TeamNotFoundException e)
        {
            return NotFound($"No Team with id {id} found");
        }
        catch (BoardNotFoundException e)
        {
            return BadRequest($"No Board with id {team.BoardId} found");
        }
        await hub.SendUpdatedTeamMessage(teamToUpdate.BoardId);
        return Ok(new TeamDTO(teamToUpdate));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var team = await repository.DeleteTeamAsync(id);
        if (team == null)
        {
            return NoContent();
        }
        await hub.SendCreatedTeamMessage(team.BoardId);
        return NoContent();
    }
}

public record struct TeamCreationParams(string Name, int BoardId, float SrFrequency, float LrFrequency);