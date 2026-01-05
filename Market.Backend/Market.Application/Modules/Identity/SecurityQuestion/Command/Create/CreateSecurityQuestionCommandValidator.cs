namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Create;

public sealed class CreateSecurityQuestionCommandValidator
    : AbstractValidator<CreateSecurityQuestionCommand>
{
    public CreateSecurityQuestionCommandValidator()
    {
        RuleFor(x => x.MarketUserEntityId)
            .GreaterThan(0);

        RuleFor(x => x.Question)
            .NotEmpty().WithMessage("Question is required.")
            .MaximumLength(SecurityQuestionEntity.Constraints.QuestionMaxLength);

        RuleFor(x => x.Answer)
            .NotEmpty().WithMessage("Answer is required.")
            .MaximumLength(SecurityQuestionEntity.Constraints.AnswerMaxLength);
    }
}