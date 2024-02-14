using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;

namespace FunWithEF.Controllers;

public class WebSocketController : ControllerBase {
    private readonly ILogger<WebSocketController> logger;

    public WebSocketController(ILogger<WebSocketController> logger) {
        this.logger = logger;
    }


    [Route("/ws")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task Get() {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            logger.LogInformation("WebSocket connection established");
            await Echo(webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = 400;
        }
    }

    private async Task Echo(WebSocket webSocket) {
        var buffer = new byte[1024 * 4];
        var receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!receiveResult.CloseStatus.HasValue)
        {
            await webSocket.SendAsync(
                new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                receiveResult.MessageType,
                receiveResult.EndOfMessage,
                CancellationToken.None);

            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        await webSocket.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
        
        logger.LogInformation("WebSocket connection closed");
    }
}