namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.GetById;

public sealed class GetSecQByIdQuery : IRequest<GetSecQByIdQueryDto>
{
    public int Id { get; set; }
}