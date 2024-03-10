using Tests.Mocks;

namespace Tests;

public class TasksControllerTests {
    private readonly MockJobTaskRepository repository;
    private readonly TasksController controller;

    //ctor
    public TasksControllerTests() {
        repository = new MockJobTaskRepository();
        controller = new TasksController(null!, new VoidLogNineHub(), repository);
    }

    [Fact]
    public async Task GetAll_ReturnsAllTasks() {

        // Arrange
        Seed();

        // Act
        var result = await controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var tasks = Assert.IsType<List<JobTask>>(okResult.Value);
        Assert.Equal(3, tasks.Count);
    }

    [Fact]
    public async Task GetById_ReturnsTask() {
        // Arrange
        Seed();

        // Act
        var result = await controller.GetById(2);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var task = Assert.IsType<JobTaskDTO>(okResult.Value);
        Assert.Equal(2, task.Id);
        Assert.Equal("Task 2", task.Title);
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
    public async Task Create_ReturnsCreatedTask() {
        // Arrange
        Seed();
        var newTask = new JobTaskCreationParams{
            BoardId = 1,
            Title = "New Task",
            Description = "New Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair
        };

        // Act
        var result = await controller.Create(newTask);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        var task = Assert.IsType<JobTaskDTO>(createdResult.Value);
        Assert.Equal(4, task.Id);
        Assert.Equal("New Task", task.Title);
    }

    [Fact]
    public async Task Create_ReturnsBadRequestBoard() {
        // Arrange
        Seed();
        var newTask = new JobTaskCreationParams{
            BoardId = 4,
            Title = "New Task",
            Description = "New Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair
        };

        // Act
        var result = await controller.Create(newTask);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Create_ReturnsBadRequestTeam() {
        // Arrange
        Seed();
        var newTask = new JobTaskCreationParams{
            BoardId = 1,
            Title = "New Task",
            Description = "New Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair,
            TargetId = 4
        };

        // Act
        var result = await controller.Create(newTask);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsUpdatedTask() {
        // Arrange
        Seed();
        var updatedTask = new JobTaskCreationParams{
            BoardId = 1,
            Title = "Updated Task",
            Description = "Updated Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair
        };

        // Act
        var result = await controller.Update(2, updatedTask);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var task = Assert.IsType<JobTaskDTO>(okResult.Value);
        Assert.Equal(2, task.Id);
        Assert.Equal("Updated Task", task.Title);
    }

    [Fact]
    public async Task Update_ReturnsNotFoundTask() {
        // Arrange
        Seed();
        var updatedTask = new JobTaskCreationParams{
            BoardId = 1,
            Title = "Updated Task",
            Description = "Updated Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair
        };

        // Act
        var result = await controller.Update(4, updatedTask);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequestBoard() {
        // Arrange
        Seed();
        var updatedTask = new JobTaskCreationParams{
            BoardId = 4,
            Title = "Updated Task",
            Description = "Updated Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair
        };

        // Act
        var result = await controller.Update(2, updatedTask);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_ReturnsBadRequestTeam() {
        // Arrange
        Seed();
        var updatedTask = new JobTaskCreationParams{
            BoardId = 1,
            Title = "Updated Task",
            Description = "Updated Task Description",
            Status = JobTask.JobTaskStatus.Todo,
            Priority = JobTask.JobTaskPriority.Low,
            TaskType = JobTask.JobTaskType.Repair,
            TargetId = 4
        };

        // Act
        var result = await controller.Update(2, updatedTask);

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
        var tasks = new List<JobTask>{
            new(){ Id = 1, VisualId = 1, BoardId = 1, Title = "Task 1", Description = "Task 1 Description" },
            new(){ Id = 2, VisualId = 2, BoardId = 1, Title = "Task 2", Description = "Task 2 Description" },
            new(){ Id = 3, VisualId = 3, BoardId = 2, Title = "Task 3", Description = "Task 3 Description" }
        };
        var boards = new List<Board>{
            new(){ Id = 1, Title = "Board 1", VisualIdCounter = 3 },
            new(){ Id = 2, Title = "Board 2", VisualIdCounter = 1 }
        };
        var teams = new List<Team>{
            new(){ Id = 1, Name = "Team 1" },
            new(){ Id = 2, Name = "Team 2" }
        };
        repository.SeedData(tasks, boards, teams);
    }
}