namespace FunWithEF;

public class Team {
    public int Id { get; set; }
    public string Name { get; set; }
    public int BoardId { get; set; }
    public Board Board { get; set; }

    public float SrFrequency { get; set; }
    public float LrFrequency { get; set; }
}

public record struct TeamDTO(int Id, string Name, int BoardId, float SrFrequency, float LrFrequency); 