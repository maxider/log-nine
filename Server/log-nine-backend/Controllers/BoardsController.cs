using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class BoardsController : ControllerBase {
    private readonly ILogger<BoardsController> logger;
    private readonly AppContext context;

    public BoardsController(ILogger<BoardsController> logger, AppContext context) {
        this.logger = logger;
        this.context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var boards = await context.Boards.Select(b => new BoardDTO{
            Id = b.Id,
            Title = b.Title
        }).ToListAsync();
        return Ok(boards);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }
        return Ok(new BoardDTO{
            Id = board.Id,
            Title = board.Title
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(BoardCreationParams board) {
        var newBoard = new Board{ Title = board.Title };
        context.Boards.Add(newBoard);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new{ id = newBoard.Id }, newBoard);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }
        context.Boards.Remove(board);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id}/tasks")]
    public async Task<IActionResult> GetTasks(int id) {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }
        var tasks = await context.JobTasks.Where(t => t.BoardId == id).Select(t => new JobTaskDTO{
            Id = t.Id,
            VisualId = t.VisualId,
            BoardId = t.BoardId,
            TargetId = t.TargetId,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Priority = t.Priority,
            TaskType = t.TaskType
        }).ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}/teams")]
    public async Task<IActionResult> GetTeams(int id) {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }
        var teams = await context.Teams.Where(t => t.BoardId == id).Select(t => new TeamDTO{
            Id = t.Id,
            Name = t.Name,
            BoardId = t.BoardId,
            SrFrequency = t.SrFrequency,
            LrFrequency = t.LrFrequency
        }).ToListAsync();
        return Ok(teams);
    }
}

public record struct BoardCreationParams(string Title);