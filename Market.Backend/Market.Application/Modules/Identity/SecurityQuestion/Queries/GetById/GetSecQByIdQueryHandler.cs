namespace Market.Application.Modules.Identity.SecurityQuestions.Queries.GetById;

public sealed class GetSecurityQuestionByIdQueryHandler(IAppDbContext ctx)
    : IRequestHandler<GetSecQByIdQuery, GetSecurityQuestionByIdQueryDto>
{
    public async Task<GetSecurityQuestionByIdQueryDto> Handle(
        GetSecQByIdQuery request, CancellationToken ct)
    {
        var entity = await ctx.SecurityQuestions
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new GetSecurityQuestionByIdQueryDto
            {
                Id = x.Id,
                MarketUserEntityId = x.MarketUserEntityId,
                Question = x.Question,
                Answer = x.Answer
            })
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Security question (ID={request.Id}) not found.");

        return entity;
    }
}