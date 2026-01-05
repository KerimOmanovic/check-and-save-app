namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.GetById;

public sealed class GetSecurityQuestionByIdQueryValidator
    : AbstractValidator<GetSecurityQuestionByIdQuery>
{
    public GetSecurityQuestionByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}