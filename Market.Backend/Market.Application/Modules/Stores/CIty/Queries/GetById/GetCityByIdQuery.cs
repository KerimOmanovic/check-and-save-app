namespace Market.Application.Modules.Store.Cities.Queries.GetById;

public class GetCityByIdQuery : IRequest<GetCityByIdQueryDto>
{
    public int Id { get; set; }
}