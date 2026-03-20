using AuthService.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InternalController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public InternalController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("users/{id}/google-token")]
    public async Task<IActionResult> GetGoogleToken(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user == null || string.IsNullOrEmpty(user.GoogleAccessToken))
            return NotFound();

        return Ok(new { AccessToken = user.GoogleAccessToken });
    }
}
