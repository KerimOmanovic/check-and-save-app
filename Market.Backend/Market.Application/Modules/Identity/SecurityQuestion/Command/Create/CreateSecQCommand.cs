namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Create;

public sealed class CreateSecQCommand : IRequest<int>
{
    public int MarketUserEntityId { get; set; }
    public string Question { get; set; }
    public string Answer { get; set; }
}