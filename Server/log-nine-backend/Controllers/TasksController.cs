using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase {
    private readonly ILogger<TasksController> logger;
    private readonly AppContext context;

    public TasksController(ILogger<TasksController> logger, AppContext context) {
        this.logger = logger;
        this.context = context;
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
        var newTask = new LogNineBackend.Models.JobTask{
            VisualId = jobTask.VisualId,
            BoardId = jobTask.BoardId,
            Title = jobTask.Title,
            Description = jobTask.Description,
            Status = jobTask.Status,
            Priority = jobTask.Priority,
            TaskType = jobTask.TaskType
        };
        context.JobTasks.Add(newTask);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new{ id = newTask.Id }, newTask);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, JobTaskCreationParams jobTask) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        task.VisualId = jobTask.VisualId;
        task.BoardId = jobTask.BoardId;
        task.Title = jobTask.Title;
        task.Description = jobTask.Description;
        task.Status = jobTask.Status;
        task.Priority = jobTask.Priority;
        task.TaskType = jobTask.TaskType;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/increment")]
    public async Task<IActionResult> IncrementStatus(int id) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        task.Status++;
        task.Status = ClampStatus(task);
        await context.SaveChangesAsync();
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

    private static LogNineBackend.Models.JobTask.JobTaskStatus ClampStatus(LogNineBackend.Models.JobTask task) {
        return (LogNineBackend.Models.JobTask.JobTaskStatus)Math.Clamp((int)task.Status, 0, (int)LogNineBackend.Models.JobTask.JobTaskStatus.Cancelled);
    }

    [HttpPatch("{id}/decrement")]
    public async Task<IActionResult> DecrementStatus(int id) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        task.Status--;
        task.Status = ClampStatus(task);
        await context.SaveChangesAsync();
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        context.JobTasks.Remove(task);
        await context.SaveChangesAsync();
        return NoContent();
    }
}

public record struct JobTaskCreationParams(int VisualId, int BoardId, string Title, string Description,
    LogNineBackend.Models.JobTask.JobTaskStatus Status, LogNineBackend.Models.JobTask.JobTaskPriority Priority, LogNineBackend.Models.JobTask.JobTaskType TaskType);