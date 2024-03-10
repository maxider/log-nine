namespace LogNineBackend.Exceptions;

public class TaskNotFoundException : Exception {
    public TaskNotFoundException(int taskId) : base($"No Task with id {taskId} found") {
    }
}

public class BoardNotFoundException : Exception {
    public BoardNotFoundException(int boardId) : base($"No Board with id {boardId} found") {
    }
}

public class TeamNotFoundException : Exception {
    public TeamNotFoundException(int teamId) : base($"No Team with id {teamId} found") {
    }
}