namespace Market.Application.Modules.Identity.PublicUsers.Commands.Delete;

public class DeletePublicUserCommand : IRequest<Unit>
{
    public int Id { get; set; }
}