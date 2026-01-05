namespace Market.Application.Modules.Auth.RefreshTokens.Commands.Revoke;

public sealed class RevokeRefreshTokenCommandValidator
    : AbstractValidator<RevokeRefreshTokenCommand>
{
    public RevokeRefreshTokenCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}