using LogNineBackend.Controllers;
using LogNineBackend.Exceptions;
using LogNineBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Repositories;

public class JobTaskRepository : IJobTaskRepository {
    private readonly AppContext context;

    public JobTaskRepository(AppContext context) {
        this.context = context;
    }

    public ValueTask<JobTask?> GetJobTaskByIdAsync(int id) {
        return context.JobTasks.FindAsync(id);
    }

    public IEnumerable<JobTask> GetJobTasksByIds(IEnumerable<int> ids) {
        return context.JobTasks.Where(t => ids.Contains(t.Id));
    }

    public Task<List<JobTask>> GetAllJobTasksAsync() {
        return context.JobTasks.ToListAsync();
    }

    public async Task<JobTask> CreateJobTaskAsync(JobTaskCreationParams jobTask) {
        await using var transaction = await context.Database.BeginTransactionAsync();
        var board = await CheckForeignKeyConstraints(jobTask);

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

        return newTask;
    }

    public async Task<JobTask> UpdateJobTaskAsync(int id, JobTaskCreationParams jobTask) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            throw new TaskNotFoundException(id);
        }

        await CheckForeignKeyConstraints(jobTask);

        task.BoardId = jobTask.BoardId;
        task.TargetId = jobTask.TargetId;
        task.Title = jobTask.Title;
        task.Description = jobTask.Description;
        task.Status = jobTask.Status;
        task.Priority = jobTask.Priority;
        task.TaskType = jobTask.TaskType;
        await context.SaveChangesAsync();

        return task;
    }

    public async Task<JobTask?> DeleteJobTaskAsync(int id) {
        var task = await context.JobTasks.FindAsync(id);
        if (task == null)
        {
            return null;
        }

        context.JobTasks.Remove(task);
        await context.SaveChangesAsync();
        return task;
    }

    private async Task<Board> CheckForeignKeyConstraints(JobTaskCreationParams jobTask) {
        var board = await context.Boards.FindAsync(jobTask.BoardId);

        if (board == null)
        {
            throw new BoardNotFoundException(jobTask.BoardId);
        }

        if (jobTask.TargetId != null)
        {
            var target = await context.Teams.FindAsync(jobTask.TargetId);
            if (target == null)
            {
                throw new TeamNotFoundException(jobTask.TargetId.Value);
            }
        }
        return board;
    }
}