namespace LogNineBackend.Models;

public class Board {
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<JobTask> Tasks { get; set; } = new();
    public List<Team> Teams { get; set; } = new();
}

public record struct BoardDTO(int Id, string Title);