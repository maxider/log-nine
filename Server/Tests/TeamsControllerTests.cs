using Tests.Mocks;

namespace Tests;

public class TeamsControllerTests {
    private readonly MockTeamRepository repository;
    private readonly TeamsController controller;

    public TeamsControllerTests() {
        repository = new MockTeamRepository();
        controller = new TeamsController(null!, repository, new VoidLogNineHub());
    }

    [Fact]
    public async Task GetAll_ReturnsAllTeams() {
        // Arrange
        Seed();

        // Act
        var result = await controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var teams = Assert.IsType<List<Team>>(okResult.Value);
        Assert.Equal(3, teams.Count);
    }

    [Fact]
    public async Task GetById_ReturnsTeam() {
        // Arrange
        Seed();

        // Act
        var result = await controller.GetById(2);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var team = Assert.IsType<TeamDTO>(okResult.Value);
        Assert.Equal(2, team.Id);
        Assert.Equal("Team 2", team.Name);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound() {
        // Arrange
        Seed();

        // Act
        var result = await controller.GetById(4);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_ReturnsCreatedTeam() {
        // Arrange
        Seed();
        var newTeam = new TeamCreationParams{
            BoardId = 1,
            Name = "New Team",
            LrFrequency = 1,
            SrFrequency = 2
        };

        // Act
        var result = await controller.Create(newTeam);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        var team = Assert.IsType<TeamDTO>(createdAtActionResult.Value);
        Assert.Equal(4, team.Id);
        Assert.Equal("New Team", team.Name);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest() {
        // Arrange
        Seed();
        var newTeam = new TeamCreationParams{
            BoardId = 4,
            Name = "New Team",
            LrFrequency = 1,
            SrFrequency = 2
        };

        // Act
        var result = await controller.Create(newTeam);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsUpdatedTeam() {
        // Arrange
        Seed();
        var updatedTeam = new TeamCreationParams{
            BoardId = 1,
            Name = "Updated Team",
            LrFrequency = 1,
            SrFrequency = 2
        };

        // Act
        var result = await controller.Update(2, updatedTeam);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var team = Assert.IsType<TeamDTO>(okResult.Value);
        Assert.Equal(2, team.Id);
        Assert.Equal("Updated Team", team.Name);
    }

    [Fact]
    public async Task Update_ReturnsNotFound() {
        // Arrange
        Seed();
        var updatedTeam = new TeamCreationParams{
            BoardId = 1,
            Name = "Updated Team",
            LrFrequency = 1,
            SrFrequency = 2
        };

        // Act
        var result = await controller.Update(4, updatedTeam);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
    
    [Fact]
    public async Task Update_ReturnsBadRequest() {
        // Arrange
        Seed();
        var updatedTeam = new TeamCreationParams{
            BoardId = 4,
            Name = "Updated Team",
            LrFrequency = 1,
            SrFrequency = 2
        };

        // Act
        var result = await controller.Update(2, updatedTeam);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent() {
        // Arrange
        Seed();

        // Act
        var result = await controller.Delete(2);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenNotFound() {
        // Arrange
        Seed();

        // Act
        var result = await controller.Delete(4);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    private void Seed() {
        var seedBoards = new List<Board>{
            new Board{ Id = 1, Title = "Board 1", VisualIdCounter = 0 },
            new Board{ Id = 2, Title = "Board 2", VisualIdCounter = 0 },
            new Board{ Id = 3, Title = "Board 3", VisualIdCounter = 0 }
        };

        var seedTeams = new List<Team>{
            new Team{ Id = 1, Name = "Team 1", BoardId = 1, LrFrequency = 1, SrFrequency = 2 },
            new Team{ Id = 2, Name = "Team 2", BoardId = 2, LrFrequency = 1, SrFrequency = 2 },
            new Team{ Id = 3, Name = "Team 3", BoardId = 3, LrFrequency = 1, SrFrequency = 2 }
        };

        repository.SeedData(new List<JobTask>(), seedBoards, seedTeams);
    }
}