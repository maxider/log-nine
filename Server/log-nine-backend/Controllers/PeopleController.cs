using LogNineBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend.Controllers;

[ApiController]
[Route("[controller]")]
public class PeopleController : ControllerBase {
    private readonly ILogger<PeopleController> logger;
    private readonly AppContext context;
    private readonly IHubContext<LogNineHub> hubContext;

    public PeopleController(ILogger<PeopleController> logger, AppContext context, IHubContext<LogNineHub> hubContext) {
        this.logger = logger;
        this.context = context;
        this.hubContext = hubContext;
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
            return NotFound("Board not found");
        }

        // Validate person name is not empty
        if (string.IsNullOrWhiteSpace(person.Name))
        {
            return BadRequest("Person name cannot be empty");
        }

        var newPerson = new Person{
            Name = person.Name,
            BoardId = person.BoardId
        };

        context.People.Add(newPerson);
        await context.SaveChangesAsync();
        await transaction.CommitAsync();
        await hubContext.Clients.All.SendAsync("ReceiveMessage", $"PersonCreated:{newPerson.BoardId}");
        return Ok(new PersonDTO(newPerson));
    }
}

public struct PersonCreationParams {
    public string Name { get; set; }
    public int BoardId { get; set; }
}