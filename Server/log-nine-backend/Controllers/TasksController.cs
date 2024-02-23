using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase {
    private readonly ILogger<TasksController> logger;
    private readonly AppContext context;
    private readonly LogNineHub hub;
    
    public TasksController(ILogger<TasksController> logger, AppContext context, LogNineHub hub) {
        this.logger = logger;
        this.context = context;
        this.hub = hub;
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
            return NotFound();
        }
        
        //TODO: check if target exists.

        var visualId = board.VisualIdCounter;
        var newTask = new JobTask{
            VisualId = visualId,
            BoardId = jobTask.BoardId,
            Title = jobTask.Title,
            Description = jobTask.Description,
            Status = jobTask.Status,
            Priority = jobTask.Priority,
            TaskType = jobTask.TaskType,
            TargetId = jobTask.TargetId
        };
        context.JobTasks.Add(newTask);
        board.VisualIdCounter++;
        await context.SaveChangesAsync();
        await transaction.CommitAsync();
        await hub.SendCreatedTaskMessage(jobTask.BoardId);
        return CreatedAtAction(nameof(GetById), new{ id = newTask.Id }, new JobTaskDTO(newTask));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, JobTaskCreationParams jobTask) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        task.BoardId = jobTask.BoardId;
        task.TargetId = jobTask.TargetId;
        task.Title = jobTask.Title;
        task.Description = jobTask.Description;
        task.Status = jobTask.Status;
        task.Priority = jobTask.Priority;
        task.TaskType = jobTask.TaskType;
        await context.SaveChangesAsync();
        await hub.SendUpdatedTaskMessage(jobTask.BoardId);
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
        await hub.SendUpdatedTaskMessage(task.BoardId);
        return NoContent();
    }
}

public record struct JobTaskCreationParams(int BoardId, string Title, string Description, int? TargetId,
    JobTask.JobTaskStatus Status, JobTask.JobTaskPriority Priority, JobTask.JobTaskType TaskType);