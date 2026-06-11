namespace Market.Application.Modules.Auth.Commands.Login;


public sealed class LoginCommandDto
{
 
    public string AccessToken { get; set; }


    public string RefreshToken { get; set; }

   
    public DateTime ExpiresAtUtc { get; set; }

    public DateTime AccessTokenExpiresAtUtc { get; set; }

    public DateTime RefreshTokenExpiresAtUtc { get; set; }
/// <summary>
/// Represents a pair of tokens (access + refresh) that the client receives upon login or token refresh.
/// </summary>
public sealed class LoginCommandDto
{
 
    public string AccessToken { get; set; }


    public string RefreshToken { get; set; }

   
    public DateTime ExpiresAtUtc { get; set; }

    public DateTime AccessTokenExpiresAtUtc { get; set; }

    public DateTime RefreshTokenExpiresAtUtc { get; set; }
}