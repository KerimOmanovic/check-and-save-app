namespace Market.Application.Modules.Store.Cities.Queries.GetById;

public sealed class GetCityByIdQueryValidator : AbstractValidator<GetCityByIdQuery>
{
    public GetCityByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Id must be a positive value.");
    }
}