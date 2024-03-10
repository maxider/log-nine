using LogNineBackend;

namespace Tests;

public class VoidLogNineHub : ILogNineHub {
    public Task SendCreatedTaskMessage(int boardId) {
        return Task.CompletedTask;
    }

    public Task SendUpdatedTaskMessage(int boardId) {
        return Task.CompletedTask;
    }

    public Task SendCreatedTeamMessage(int boardId) {
        return Task.CompletedTask;
    }

    public Task SendUpdatedTeamMessage(int boardId) {
        return Task.CompletedTask;
    }
}