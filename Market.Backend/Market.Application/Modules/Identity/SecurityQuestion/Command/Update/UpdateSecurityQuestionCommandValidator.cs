namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Update;

public sealed class UpdateSecurityQuestionCommandValidator
    : AbstractValidator<UpdateSecurityQuestionCommand>
{
    public UpdateSecurityQuestionCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Question)
            .NotEmpty()
            .MaximumLength(SecurityQuestionEntity.Constraints.QuestionMaxLength);

        RuleFor(x => x.Answer)
            .NotEmpty()
            .MaximumLength(SecurityQuestionEntity.Constraints.AnswerMaxLength);
    }
}