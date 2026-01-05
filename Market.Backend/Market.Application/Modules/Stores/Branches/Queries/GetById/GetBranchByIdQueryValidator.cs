namespace Market.Application.Modules.Store.Branches.Queries.GetById;

public sealed class GetBranchByIdQueryValidator : AbstractValidator<GetBranchByIdQuery>
{
    public GetBranchByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Id must be a positive value.");
    }
}