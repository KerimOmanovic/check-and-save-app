using Market.Application.Modules.Stores.Branches.Queries.Map;
using Market.Domain.Entities.StoreEntities;
using Market.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Market.Application.Modules.Stores.Branches.Queries.Map;

public sealed class GetBranchesMapQueryHandler
    : IRequestHandler<GetBranchesMapQuery, List<BranchMapItemDto>>
{
    private readonly DatabaseContext _db;

    public GetBranchesMapQueryHandler(DatabaseContext db)
    {
        _db = db;
    }

    public async Task<List<BranchMapItemDto>> Handle(
        GetBranchesMapQuery request,
        CancellationToken cancellationToken)
    {
        return await _db.Set<BranchEntity>()
            .AsNoTracking()
            .Where(b => !b.IsDeleted
                        && b.IsActive
                        && b.Latitude.HasValue
                        && b.Longitude.HasValue)
            .Include(b => b.StoreEntity)
            .Select(b => new BranchMapItemDto
            {
                Id = b.Id,
                StoreName = b.StoreEntity!.Name,
                Address = b.Address,
                Contact = b.Contact,
                Email = b.Email,
                Latitude = b.Latitude!.Value,
                Longitude = b.Longitude!.Value,
            })
            .ToListAsync(cancellationToken);
    }
}