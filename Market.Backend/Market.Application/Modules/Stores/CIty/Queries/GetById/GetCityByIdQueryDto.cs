namespace Market.Application.Modules.Store.Cities.Queries.GetById;

public class GetCityByIdQueryDto
{
    public int Id { get; init; }
    public string Name { get; init; }
    public int PostalCode { get; init; }
}