using Microsoft.AspNetCore.SignalR;

namespace LogNineBackend; 

public class LogNineHub: Hub {
    private readonly ILogger<LogNineHub> logger;

    public LogNineHub(ILogger<LogNineHub> logger) {
        this.logger = logger;
    }

    public async Task SendCreatedTaskMessage(int boardId) {     
        await Clients.All.SendAsync("ReceiveMessage", $"TaskCreated:{boardId}");
    }
    
    public async Task SendUpdatedTaskMessage(int boardId) {
        await Clients.All.SendAsync("ReceiveMessage", $"TaskUpdated:{boardId}");
    }
    
    public async Task SendCreatedTeamMessage(int boardId) {
        await Clients.All.SendAsync("ReceiveMessage", $"TeamCreated:{boardId}");
    }
    
    public async Task SendUpdatedTeamMessage(int boardId) {
        await Clients.All.SendAsync("ReceiveMessage", $"TeamUpdated:{boardId}");
    }

    public async Task SendCreatedPersonMessage(int newPersonBoardId) {
        throw new NotImplementedException();
    }
}