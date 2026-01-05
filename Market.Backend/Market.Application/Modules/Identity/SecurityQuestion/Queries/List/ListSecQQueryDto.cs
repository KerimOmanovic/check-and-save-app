namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.List;

public sealed class ListSecQQueryDto
{
    public int Id { get; init; }
    public int MarketUserEntityId { get; init; }
    public string Question { get; init; }
    public string Answer { get; init; }
}