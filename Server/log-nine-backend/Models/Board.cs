using System.ComponentModel.DataAnnotations;

namespace LogNineBackend.Models;

public class Board {
    public int Id { get; set; }
    
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? PasswordHash { get; set; }
    
    public int VisualIdCounter { get; set; } = 1;
    public List<JobTask> Tasks { get; set; } = new();
    public List<Team> Teams { get; set; } = new();
}

public record struct BoardDTO(int Id, string Title, bool IsPasswordProtected);

public record struct BoardAccessRequest(int BoardId, string? Password);