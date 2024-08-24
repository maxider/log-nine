using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class PeopleController : ControllerBase {
    private readonly ILogger<PeopleController> logger;
    private readonly AppContext context;
    private readonly LogNineHub hub;

    public PeopleController(ILogger<PeopleController> logger, AppContext context, LogNineHub hub) {
        this.logger = logger;
        this.context = context;
        this.hub = hub;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll() {
        var people = await context.People.Select(p => new PersonDTO(p)).ToListAsync();
        return Ok(people);
    }

    [HttpPost]
    public async Task<IActionResult> Create(PersonCreationParams person) {
        await using var transaction = await context.Database.BeginTransactionAsync();
        var board = await context.Boards.FindAsync(person.BoardId);

        if (board == null)
        {
            return NotFound();
        }

        var newPerson = new Person{
            Name = person.Name,
            BoardId = person.BoardId
        };

        context.People.Add(newPerson);
        await context.SaveChangesAsync();
        await transaction.CommitAsync();
        await hub.SendCreatedPersonMessage(newPerson.BoardId);
        return Ok(newPerson);
    }
}

public struct PersonCreationParams {
    public string Name { get; set; }
    public int BoardId { get; set; }
}