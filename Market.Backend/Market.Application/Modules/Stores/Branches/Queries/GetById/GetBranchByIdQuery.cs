using MediatR;

namespace Market.Application.Modules.Store.Branches.Queries.GetById;

public class GetBranchByIdQuery : IRequest<GetBranchByIdQueryDto>
{
    public int Id { get; set; }
}