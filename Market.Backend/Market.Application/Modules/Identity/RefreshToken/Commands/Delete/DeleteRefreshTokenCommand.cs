namespace Market.Application.Modules.Auth.RefreshTokens.Commands.Delete;

public sealed class DeleteRefreshTokenCommand : IRequest<Unit>
{
    public int Id { get; set; }
}