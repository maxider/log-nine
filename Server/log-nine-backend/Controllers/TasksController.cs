using LogNineBackend.Exceptions;
using LogNineBackend.Models;
using LogNineBackend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase {
    private readonly ILogger<TasksController> logger;
    private readonly IJobTaskRepository repository;
    private readonly ILogNineHub hub;

    public TasksController(ILogger<TasksController> logger, ILogNineHub hub, IJobTaskRepository repository) {
        this.logger = logger;
        this.hub = hub;
        this.repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var tasks = await repository.GetAllJobTasksAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) {
        var task = await repository.GetJobTaskByIdAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(new JobTaskDTO(task));
    }

    [HttpPost]
    public async Task<IActionResult> Create(JobTaskCreationParams jobTask) {
        JobTask task;
        try
        {
            task = await repository.CreateJobTaskAsync(jobTask);
        }
        catch (BoardNotFoundException)
        {
            return NotFound($"No Board with id {jobTask.BoardId} found");
        }
        catch (TeamNotFoundException)
        {
            return NotFound($"No Team with id {jobTask.TargetId} found");
        }
        await hub.SendCreatedTaskMessage(jobTask.BoardId);
        return CreatedAtAction(nameof(GetById), new{ id = task.Id }, new JobTaskDTO(task));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, JobTaskCreationParams jobTask) {

        JobTask task;
        try
        {
            task = await repository.UpdateJobTaskAsync(id, jobTask);
        }
        catch (TaskNotFoundException)
        {
            return NotFound($"No Task with id {id} found");
        }
        catch (BoardNotFoundException)
        {
            return NotFound($"No Board with id {jobTask.BoardId} found");
        }
        catch (TeamNotFoundException)
        {
            return NotFound($"No Team with id {jobTask.TargetId} found");
        }

        await hub.SendUpdatedTaskMessage(jobTask.BoardId);
        return Ok(new JobTaskDTO(task));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var task = await repository.DeleteJobTaskAsync(id);
        if (task == null)
        {
            return NoContent();
        }
        await hub.SendUpdatedTaskMessage(task.BoardId);
        return NoContent();
    }
}

public record struct JobTaskCreationParams(int BoardId, string Title, string Description, int? TargetId,
    JobTask.JobTaskStatus Status, JobTask.JobTaskPriority Priority, JobTask.JobTaskType TaskType);