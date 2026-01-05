namespace Market.Application.Modules.Store.Cities.Commands.Delete;

public class DeleteCityCommand : IRequest<Unit>
{
    public int Id { get; set; }
}