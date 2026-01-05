namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.List;

public sealed class ListSecurityQuestionsQuery : BasePagedQuery<ListSecurityQuestionsQueryDto>
{
    public int? MarketUserEntityId { get; init; }
    public string? Search { get; init; }
}