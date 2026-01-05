namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Delete;

public sealed class DeleteSecQCommand : IRequest<Unit>
{
    public int Id { get; set; }
}