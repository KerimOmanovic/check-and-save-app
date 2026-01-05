namespace Market.Application.Modules.Auth.RefreshTokens.Commands.Create;

public sealed class CreateRefreshTokenCommand : IRequest<int>
{
    public string TokenHash { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
    public int UserId { get; set; }
    public string? Fingerprint { get; set; }
}