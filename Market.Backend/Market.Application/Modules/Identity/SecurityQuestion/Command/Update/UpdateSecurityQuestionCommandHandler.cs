namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Update;

public sealed class UpdateSecurityQuestionCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateSecurityQuestionCommand, Unit>
{
    public async Task<Unit> Handle(UpdateSecurityQuestionCommand request, CancellationToken ct)
    {
        var entity = await ctx.SecurityQuestions
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Security question (ID={request.Id}) not found.");

        entity.Question = request.Question.Trim();
        entity.Answer = request.Answer.Trim();

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}