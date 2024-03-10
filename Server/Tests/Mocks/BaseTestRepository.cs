namespace Tests.Mocks;

public abstract class BaseTestRepository {
    protected readonly Dictionary<int, JobTask> Tasks = new();
    protected readonly Dictionary<int, Board> Boards = new();
    protected readonly Dictionary<int, Team> Teams = new();

    public void SeedData(List<JobTask> seedTasks, List<Board> seedBoards, List<Team> seedTeams) {
        foreach (var task in seedTasks)
        {
            Tasks.Add(task.Id, task);
        }

        foreach (var board in seedBoards)
        {
            Boards.Add(board.Id, board);
        }

        foreach (var team in seedTeams)
        {
            Teams.Add(team.Id, team);
        }
    }
}