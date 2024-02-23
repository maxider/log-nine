﻿using Microsoft.AspNetCore.SignalR;

namespace LogNineBackend; 

public class LogNineHub: Hub {
    private readonly ILogger<LogNineHub> logger;

    public LogNineHub(ILogger<LogNineHub> logger) {
        this.logger = logger;
    }

    public override async Task OnConnectedAsync() {
        logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await Clients.All.SendAsync("ReceiveMessage", $"{Context.ConnectionId} joined");
        logger.LogInformation("Sending message to all clients");
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
}