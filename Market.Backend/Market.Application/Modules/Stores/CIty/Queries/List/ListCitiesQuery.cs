namespace Market.Application.Modules.Store.Cities.Queries.List;

public sealed class ListCitiesQuery : BasePagedQuery<ListCitiesQueryDto>
{
    public string? Search { get; init; }
    public int? PostalCode { get; init; }
}