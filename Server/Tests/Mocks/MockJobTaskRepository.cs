namespace Tests;

public class MockJobTaskRepository : IJobTaskRepository {
    private readonly Dictionary<int, JobTask> tasks = new();
    private readonly Dictionary<int, Board> boards = new();
    private readonly Dictionary<int, Team> teams = new();

    public void SeedData(List<JobTask> seedTasks, List<Board> seedBoards, List<Team> seedTeams) {
        foreach (var task in seedTasks)
        {
            tasks.Add(task.Id, task);
        }

        foreach (var board in seedBoards)
        {
            boards.Add(board.Id, board);
        }

        foreach (var team in seedTeams)
        {
            teams.Add(team.Id, team);
        }
    }

    public ValueTask<JobTask?> GetJobTaskByIdAsync(int id) {
        return new ValueTask<JobTask?>(tasks.TryGetValue(id, out var task) ? task : null);
    }

    public IEnumerable<JobTask> GetJobTasksByIds(IEnumerable<int> ids) {
        return tasks.Values.Where(t => ids.Contains(t.Id));
    }

    public Task<List<JobTask>> GetAllJobTasksAsync() {
        return Task.FromResult(tasks.Values.ToList());
    }

    public Task<JobTask> CreateJobTaskAsync(JobTaskCreationParams jobTask) {
        if (!boards.TryGetValue(jobTask.BoardId, out var board))
        {
            throw new BoardNotFoundException(jobTask.BoardId);
        }

        if (jobTask.TargetId != null && !teams.TryGetValue(jobTask.TargetId.Value, out var team))
        {
            throw new TeamNotFoundException(jobTask.TargetId.Value);
        }

        var visualId = board.VisualIdCounter;
        var newTask = new JobTask{
            Id = tasks.Count + 1,
            VisualId = visualId,
            BoardId = jobTask.BoardId,
            Title = jobTask.Title,
            Description = jobTask.Description,
            Status = jobTask.Status,
            Priority = jobTask.Priority,
            TaskType = jobTask.TaskType,
            TargetId = jobTask.TargetId
        };
        tasks.Add(newTask.Id, newTask);
        board.VisualIdCounter++;
        return Task.FromResult(newTask);
    }

    public Task<JobTask> UpdateJobTaskAsync(int id, JobTaskCreationParams jobTask) {
        if (!tasks.TryGetValue(id, out var task))
        {
            throw new TaskNotFoundException(id);
        }

        if (!boards.TryGetValue(jobTask.BoardId, out var board))
        {
            throw new BoardNotFoundException(jobTask.BoardId);
        }

        if (jobTask.TargetId != null && !teams.TryGetValue(jobTask.TargetId.Value, out var team))
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
        if (!tasks.TryGetValue(id, out var task))
        {
            return Task.FromResult<JobTask?>(null);
        }

        tasks.Remove(id);
        return Task.FromResult<JobTask?>(task);
    }
}