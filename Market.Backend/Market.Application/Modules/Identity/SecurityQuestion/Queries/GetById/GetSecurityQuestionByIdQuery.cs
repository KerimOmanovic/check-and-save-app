namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.GetById;

public sealed class GetSecurityQuestionByIdQuery : IRequest<GetSecurityQuestionByIdQueryDto>
{
    public int Id { get; set; }
}