using System.ComponentModel.DataAnnotations;

namespace LogNineBackend.Models;

public class Person {
    public int Id { get; set; }
    public int BoardId { get; set; }
    
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;
}

public record struct PersonDTO(int Id, int BoardId, String Name) {
    public PersonDTO(Person person) : this(person.Id, person.BoardId, person.Name) {
    }
}