using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace FunWithEF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IConfiguration configuration, ILogger<AdminController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("verify")]
    public IActionResult VerifyAdminPassword([FromBody] AdminVerifyRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Password is required" });
        }

        var adminPassword = _configuration["AdminPassword"];
        
        if (string.IsNullOrEmpty(adminPassword))
        {
            _logger.LogError("AdminPassword not configured in appsettings.json");
            return StatusCode(500, new { message = "Admin password not configured" });
        }

        // Simple password comparison (you can enhance this with hashing if needed)
        if (request.Password == adminPassword)
        {
            _logger.LogInformation("Admin login successful");
            return Ok(new { success = true, message = "Admin authenticated" });
        }

        _logger.LogWarning("Failed admin login attempt");
        return Unauthorized(new { success = false, message = "Invalid admin password" });
    }
}

public record AdminVerifyRequest(string Password);

