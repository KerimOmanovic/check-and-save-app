namespace Market.Application.Modules.Auth.RefreshTokens.Queries.GetById;

public sealed class GetRefreshTokenByIdQuery : IRequest<GetRefreshTokenByIdQueryDto>
{
    public int Id { get; set; }
}