using System.Security.Claims;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YouTubeService.Services;

namespace YouTubeService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Requires valid JWT Header
public class YouTubeController : ControllerBase
{
    private readonly AuthApiClient _authApiClient;

    public YouTubeController(AuthApiClient authApiClient)
    {
        _authApiClient = authApiClient;
    }

    [HttpGet("liked-videos")]
    public async Task<IActionResult> GetLikedVideos()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid token subject.");

        // 1. Fetch Google Token from Auth Service via Internal REST call
        var googleToken = await _authApiClient.GetGoogleAccessTokenAsync(userId);
        if (string.IsNullOrEmpty(googleToken))
            return BadRequest("Could not find a valid Google Access Token for this user. Please log in again.");

        // 2. Initialize YouTube Service
        var credential = GoogleCredential.FromAccessToken(googleToken);
        var youtubeService = new Google.Apis.YouTube.v3.YouTubeService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "YouTubeSearchApp"
        });

        try
        {
            // 3. Call YouTube API
            var request = youtubeService.Videos.List("snippet");
            request.MyRating = VideosResource.ListRequest.MyRatingEnum.Like;
            request.MaxResults = 50;

            var response = await request.ExecuteAsync();

            var videos = response.Items.Select(v => new
            {
                Id = v.Id,
                Title = v.Snippet.Title,
                Description = v.Snippet.Description,
                ThumbnailUrl = v.Snippet.Thumbnails.High?.Url ?? v.Snippet.Thumbnails.Default__?.Url,
                Url = $"https://www.youtube.com/watch?v={v.Id}"
            });

            return Ok(videos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error communicating with YouTube API: {ex.Message}");
        }
    }
}
