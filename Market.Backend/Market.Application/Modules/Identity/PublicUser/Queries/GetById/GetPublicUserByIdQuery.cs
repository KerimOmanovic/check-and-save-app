namespace Market.Application.Modules.Identity.PublicUsers.Queries.GetById;

public class GetPublicUserByIdQuery : IRequest<GetPublicUserByIdQueryDto>
{
    public int Id { get; set; }
}