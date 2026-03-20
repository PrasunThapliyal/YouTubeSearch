namespace YouTubeService.Services;

public class AuthApiClient
{
    private readonly HttpClient _httpClient;

    public AuthApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string?> GetGoogleAccessTokenAsync(Guid userId)
    {
        var response = await _httpClient.GetAsync($"/api/internal/users/{userId}/google-token");
        
        if (!response.IsSuccessStatusCode)
            return null;

        var result = await response.Content.ReadFromJsonAsync<GoogleTokenResponse>();
        return result?.AccessToken;
    }
}

public class GoogleTokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
}
