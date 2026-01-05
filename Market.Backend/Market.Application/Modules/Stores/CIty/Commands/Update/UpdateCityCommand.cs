namespace Market.Application.Modules.Store.Cities.Commands.Update;

public sealed class UpdateCityCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }

    public string Name { get; set; }
    public int PostalCode { get; set; }
}