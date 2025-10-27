using System.ComponentModel.DataAnnotations;

namespace LogNineBackend.Models;

public class Team {
    public int Id { get; set; }
    
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;
    
    public int BoardId { get; set; }
    public Board Board { get; set; } = null!;

    [Range(0, 9999)]
    public float SrFrequency { get; set; }
    
    [Range(0, 9999)]
    public float LrFrequency { get; set; }
}

public record struct TeamDTO(int Id, string Name, int BoardId, float SrFrequency, float LrFrequency); 