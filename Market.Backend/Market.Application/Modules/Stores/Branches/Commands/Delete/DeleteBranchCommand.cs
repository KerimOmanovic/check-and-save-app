namespace Market.Application.Modules.Store.Branches.Commands.Delete;

public class DeleteBranchCommand : IRequest<Unit>
{
    public int Id { get; set; }
}