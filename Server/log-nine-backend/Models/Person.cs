namespace LogNineBackend.Models;

public class Person {
    public int Id { get; set; }
    public int BoardId { get; set; }
    public String Name { get; set; }
}

public record struct PersonDTO(int Id, int BoardId, String Name) {
    public PersonDTO(Person person) : this(person.Id, person.BoardId, person.Name) {
    }
}