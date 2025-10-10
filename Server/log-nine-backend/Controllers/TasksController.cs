using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase {
    private readonly ILogger<TasksController> logger;
    private readonly AppContext context;
    private readonly IHubContext<LogNineHub> hubContext;
    
    public TasksController(ILogger<TasksController> logger, AppContext context, IHubContext<LogNineHub> hubContext) {
        this.logger = logger;
        this.context = context;
        this.hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var tasks = await context.JobTasks.Select(t => new JobTaskDTO{
                Id = t.Id,
                VisualId = t.VisualId,
                BoardId = t.BoardId,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                TaskType = t.TaskType
            }
        ).ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(new JobTaskDTO{
            Id = task.Id,
            VisualId = task.VisualId,
            BoardId = task.BoardId,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            TaskType = task.TaskType
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(JobTaskCreationParams jobTask) {
        await using var transaction = await context.Database.BeginTransactionAsync();
        var board = await context.Boards.FindAsync(jobTask.BoardId);

        if (board == null)
        {
            return NotFound("Board not found");
        }
        
        // Validate target team exists if specified
        if (jobTask.TargetId.HasValue)
        {
            var targetExists = await context.Teams.AnyAsync(t => t.Id == jobTask.TargetId.Value && t.BoardId == jobTask.BoardId);
            if (!targetExists)
            {
                return BadRequest("Target team not found or does not belong to this board");
            }
        }

        // Validate assigned person exists if specified
        if (jobTask.AssignedToId.HasValue)
        {
            var personExists = await context.People.AnyAsync(p => p.Id == jobTask.AssignedToId.Value && p.BoardId == jobTask.BoardId);
            if (!personExists)
            {
                return BadRequest("Assigned person not found or does not belong to this board");
            }
        }

        var visualId = board.VisualIdCounter;
        var newTask = new JobTask{
            VisualId = visualId,
            BoardId = jobTask.BoardId,
            Title = jobTask.Title,
            Description = jobTask.Description,
            Status = jobTask.Status,
            Priority = jobTask.Priority,
            TaskType = jobTask.TaskType,
            TargetId = jobTask.TargetId,
            AssignedTo = jobTask.AssignedToId.HasValue 
                ? await context.People.FindAsync(jobTask.AssignedToId.Value) 
                : null
        };
        context.JobTasks.Add(newTask);
        board.VisualIdCounter++;
        await context.SaveChangesAsync();
        await transaction.CommitAsync();
        await hubContext.Clients.All.SendAsync("ReceiveMessage", $"TaskCreated:{jobTask.BoardId}");
        return CreatedAtAction(nameof(GetById), new{ id = newTask.Id }, new JobTaskDTO(newTask));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, JobTaskCreationParams jobTask) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound("Task not found");
        }

        // Validate target team exists if specified
        if (jobTask.TargetId.HasValue)
        {
            var targetExists = await context.Teams.AnyAsync(t => t.Id == jobTask.TargetId.Value && t.BoardId == jobTask.BoardId);
            if (!targetExists)
            {
                return BadRequest("Target team not found or does not belong to this board");
            }
        }

        // Validate assigned person exists if specified
        if (jobTask.AssignedToId.HasValue)
        {
            var personExists = await context.People.AnyAsync(p => p.Id == jobTask.AssignedToId.Value && p.BoardId == jobTask.BoardId);
            if (!personExists)
            {
                return BadRequest("Assigned person not found or does not belong to this board");
            }
        }

        task.BoardId = jobTask.BoardId;
        task.TargetId = jobTask.TargetId;
        task.Title = jobTask.Title;
        task.Description = jobTask.Description;
        task.Status = jobTask.Status;
        task.Priority = jobTask.Priority;
        task.TaskType = jobTask.TaskType;
        task.AssignedTo = jobTask.AssignedToId.HasValue 
            ? await context.People.FindAsync(jobTask.AssignedToId.Value) 
            : null;
        await context.SaveChangesAsync();
        await hubContext.Clients.All.SendAsync("ReceiveMessage", $"TaskUpdated:{jobTask.BoardId}");
        return Ok(new JobTaskDTO(task));
    }

    private static JobTask.JobTaskStatus ClampStatus(JobTask task) {
        return (JobTask.JobTaskStatus)Math.Clamp((int)task.Status, 0, (int)JobTask.JobTaskStatus.Cancelled);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        context.JobTasks.Remove(task);
        await context.SaveChangesAsync();
        await hubContext.Clients.All.SendAsync("ReceiveMessage", $"TaskUpdated:{task.BoardId}");
        return NoContent();
    }
}

public record struct JobTaskCreationParams(int BoardId, string Title, string Description, int? TargetId,
    JobTask.JobTaskStatus Status, JobTask.JobTaskPriority Priority, JobTask.JobTaskType TaskType, int? AssignedToId);