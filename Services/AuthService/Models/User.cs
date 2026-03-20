namespace AuthService.Models;

public class User
{
    public Guid Id { get; set; }
    
    public string GoogleId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    
    // Stored to make YouTube API calls on the user's behalf
    public string GoogleAccessToken { get; set; } = string.Empty;
    
    // Stored to refresh the Access Token when it expires without requiring re-login
    public string? GoogleRefreshToken { get; set; }
    
    public DateTimeOffset TokenExpiration { get; set; }
}
