using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class BoardsController : ControllerBase {
    private readonly ILogger<BoardsController> logger;
    private readonly AppContext context;
    private readonly IConfiguration configuration;

    public BoardsController(ILogger<BoardsController> logger, AppContext context, IConfiguration configuration) {
        this.logger = logger;
        this.context = context;
        this.configuration = configuration;
    }

    private static string HashPassword(string password) {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private static bool VerifyPassword(string password, string hash) {
        var hashOfInput = HashPassword(password);
        return hashOfInput == hash;
    }

    private bool VerifyAdminPassword(string? password) {
        if (string.IsNullOrWhiteSpace(password))
        {
            return false;
        }

        var adminPassword = configuration["AdminPassword"];
        return !string.IsNullOrEmpty(adminPassword) && password == adminPassword;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var boards = await context.Boards.Select(b => new BoardDTO{
            Id = b.Id,
            Title = b.Title,
            IsPasswordProtected = b.PasswordHash != null
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
            Title = board.Title,
            IsPasswordProtected = board.PasswordHash != null
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(BoardCreationParams board) {
        var newBoard = new Board{ 
            Title = board.Title,
            PasswordHash = !string.IsNullOrWhiteSpace(board.Password) 
                ? HashPassword(board.Password) 
                : null
        };
        context.Boards.Add(newBoard);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new{ id = newBoard.Id }, new BoardDTO{
            Id = newBoard.Id,
            Title = newBoard.Title,
            IsPasswordProtected = newBoard.PasswordHash != null
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BoardUpdateRequest request) {
        // Verify admin password
        if (!VerifyAdminPassword(request.AdminPassword))
        {
            logger.LogWarning($"Unauthorized update attempt for board {id}");
            return Unauthorized(new { message = "Admin authentication required" });
        }

        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }

        // Update title if provided
        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            board.Title = request.Title.Trim();
        }

        // Update password if provided (empty string removes password protection)
        if (request.Password != null)
        {
            board.PasswordHash = !string.IsNullOrWhiteSpace(request.Password) 
                ? HashPassword(request.Password) 
                : null;
        }

        await context.SaveChangesAsync();
        logger.LogInformation($"Admin updated board {id}");

        return Ok(new BoardDTO{
            Id = board.Id,
            Title = board.Title,
            IsPasswordProtected = board.PasswordHash != null
        });
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyAccess([FromBody] BoardAccessRequest request) {
        var board = await context.Boards.FindAsync(request.BoardId);
        if (board == null)
        {
            return NotFound();
        }

        // Board has no password protection
        if (board.PasswordHash == null)
        {
            return Ok(new { success = true });
        }

        // Board has password protection
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return Unauthorized(new { success = false, message = "Password required" });
        }

        if (VerifyPassword(request.Password, board.PasswordHash))
        {
            return Ok(new { success = true });
        }

        return Unauthorized(new { success = false, message = "Invalid password" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, [FromBody] AdminDeleteRequest? request) {
        // Verify admin password
        if (request == null || !VerifyAdminPassword(request.AdminPassword))
        {
            logger.LogWarning($"Unauthorized delete attempt for board {id}");
            return Unauthorized(new { message = "Admin authentication required" });
        }

        var board = await context.Boards
            .Include(b => b.Tasks)
            .Include(b => b.Teams)
            .FirstOrDefaultAsync(b => b.Id == id);
            
        if (board == null)
        {
            return NotFound();
        }

        // Delete all related entities
        var people = await context.People.Where(p => p.BoardId == id).ToListAsync();
        
        context.JobTasks.RemoveRange(board.Tasks);
        context.Teams.RemoveRange(board.Teams);
        context.People.RemoveRange(people);
        context.Boards.Remove(board);
        
        await context.SaveChangesAsync();
        logger.LogInformation($"Admin deleted board {id}");
        return NoContent();
    }

    [HttpGet("{id}/tasks")]
    public async Task<IActionResult> GetTasks(int id) {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }
        var tasks = await (context.JobTasks.Where(t => t.BoardId == id)).Select(t => new JobTaskDTO{
            Id = t.Id,
            VisualId = t.VisualId,
            BoardId = t.BoardId,
            TargetId = t.TargetId,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Priority = t.Priority,
            TaskType = t.TaskType,
            AssignedToId = t.AssignedTo != null ? t.AssignedTo.Id : null
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

    [HttpGet("{id}/people")]
    public async Task<IActionResult> GetPeople(int id) {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }
        var people = await context.People.Where(p => p.BoardId == id).Select(p => new PersonDTO(p)).ToListAsync();
        return Ok(people);
    }

    [HttpPost("{id}/admin-access")]
    public async Task<IActionResult> AdminAccess(int id, [FromBody] AdminBoardPasswordRequest request) {
        // Verify admin password
        if (!VerifyAdminPassword(request.AdminPassword))
        {
            logger.LogWarning($"Unauthorized admin access attempt for board {id}");
            return Unauthorized(new { message = "Admin authentication required" });
        }

        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            return NotFound();
        }

        logger.LogInformation($"Admin accessed board {id}");
        return Ok(new { success = true, hasPassword = board.PasswordHash != null });
    }
}

public record struct BoardCreationParams(string Title, string? Password);
public record AdminDeleteRequest(string AdminPassword);
public record AdminBoardPasswordRequest(string AdminPassword);
public record BoardUpdateRequest(string AdminPassword, string? Title, string? Password);