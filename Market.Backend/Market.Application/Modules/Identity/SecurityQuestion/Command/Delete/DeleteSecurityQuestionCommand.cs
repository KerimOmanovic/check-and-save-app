namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Delete;

public sealed class DeleteSecurityQuestionCommand : IRequest<Unit>
{
    public int Id { get; set; }
}