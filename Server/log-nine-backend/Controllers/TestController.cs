using Microsoft.AspNetCore.Mvc;

namespace LogNineBackend.Controllers; 

[ApiController]
[Route("[controller]")]
public class TestController: ControllerBase{

    private readonly LogNineHub logNineHub;

    public TestController(LogNineHub logNineHub) {
        this.logNineHub = logNineHub;
    }
    
    
    //Get endpoint which calls logNineHub.SendCreatedTaskMessage()
    [HttpGet]
    public async Task<IActionResult> Get() {
        await logNineHub.SendCreatedTaskMessage(1);
        return Ok();
    }
}