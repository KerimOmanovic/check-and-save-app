namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.GetById;

public sealed class GetSecurityQuestionByIdQueryDto
{
    public int Id { get; init; }
    public int MarketUserEntityId { get; init; }
    public string Question { get; init; }
    public string Answer { get; init; }
}