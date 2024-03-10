namespace Tests.Mocks;

public class MockJobTaskRepository : BaseTestRepository, IJobTaskRepository {
    public ValueTask<JobTask?> GetJobTaskByIdAsync(int id) {
        return new ValueTask<JobTask?>(Tasks.TryGetValue(id, out var task) ? task : null);
    }

    public IEnumerable<JobTask> GetJobTasksByIds(IEnumerable<int> ids) {
        return Tasks.Values.Where(t => ids.Contains(t.Id));
    }

    public Task<List<JobTask>> GetAllJobTasksAsync() {
        return Task.FromResult(Tasks.Values.ToList());
    }

    public Task<JobTask> CreateJobTaskAsync(JobTaskCreationParams jobTask) {
        if (!Boards.TryGetValue(jobTask.BoardId, out var board))
        {
            throw new BoardNotFoundException(jobTask.BoardId);
        }

        if (jobTask.TargetId != null && !Teams.TryGetValue(jobTask.TargetId.Value, out _))
        {
            throw new TeamNotFoundException(jobTask.TargetId.Value);
        }

        var visualId = board.VisualIdCounter;
        var newTask = new JobTask{
            Id = Tasks.Count + 1,
            VisualId = visualId,
            BoardId = jobTask.BoardId,
            Title = jobTask.Title,
            Description = jobTask.Description,
            Status = jobTask.Status,
            Priority = jobTask.Priority,
            TaskType = jobTask.TaskType,
            TargetId = jobTask.TargetId
        };
        Tasks.Add(newTask.Id, newTask);
        board.VisualIdCounter++;
        return Task.FromResult(newTask);
    }

    public Task<JobTask> UpdateJobTaskAsync(int id, JobTaskCreationParams jobTask) {
        if (!Tasks.TryGetValue(id, out var task))
        {
            throw new TaskNotFoundException(id);
        }

        if (!Boards.TryGetValue(jobTask.BoardId, out _))
        {
            throw new BoardNotFoundException(jobTask.BoardId);
        }

        if (jobTask.TargetId != null && !Teams.TryGetValue(jobTask.TargetId.Value, out _))
        {
            throw new TeamNotFoundException(jobTask.TargetId.Value);
        }

        task.BoardId = jobTask.BoardId;
        task.TargetId = jobTask.TargetId;
        task.Title = jobTask.Title;
        task.Description = jobTask.Description;
        task.Status = jobTask.Status;
        task.Priority = jobTask.Priority;
        task.TaskType = jobTask.TaskType;
        return Task.FromResult(task);
    }

    public Task<JobTask?> DeleteJobTaskAsync(int id) {
        if (!Tasks.TryGetValue(id, out var task))
        {
            return Task.FromResult<JobTask?>(null);
        }

        Tasks.Remove(id);
        return Task.FromResult<JobTask?>(task);
    }
}