namespace Market.Application.Modules.Identity.PublicUsers.Commands.Create;

public class CreatePublicUserCommand : IRequest<int>
{
    public int MarketUserEntityId { get; set; }

    public int Points { get; set; }
    public int AvatarLevel { get; set; }
}