namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Delete;

public sealed class DeleteSecurityQuestionCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DeleteSecurityQuestionCommand, Unit>
{
    public async Task<Unit> Handle(DeleteSecurityQuestionCommand request, CancellationToken ct)
    {
        var entity = await ctx.SecurityQuestions
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException("Security question not found.");

        ctx.SecurityQuestions.Remove(entity);
        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}