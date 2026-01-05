namespace Market.Application.Modules.Auth.RefreshTokens.Commands.Revoke;

public sealed class RevokeRefreshTokenCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public string? Reason { get; set; }
}