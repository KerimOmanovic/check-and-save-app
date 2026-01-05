namespace Market.Application.Modules.Identity.SecurityQuestions.Commands.Delete;

public sealed class DeleteSecurityQuestionCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DeleteSecQCommand, Unit>
{
    public async Task<Unit> Handle(DeleteSecQCommand request, CancellationToken ct)
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