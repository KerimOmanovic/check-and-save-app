namespace Market.Application.Modules.Auth.RefreshTokens.Queries.GetById;

public sealed class GetRefreshTokenByIdQueryDto
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public string TokenHash { get; init; }
    public DateTime ExpiresAtUtc { get; init; }
    public bool IsRevoked { get; init; }
    public DateTime? RevokedAtUtc { get; init; }
    public string? Fingerprint { get; init; }
}