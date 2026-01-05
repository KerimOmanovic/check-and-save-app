using Market.Domain.Entities.ProductEntities;
using Market.Domain.Entities.StoreEntities;

namespace Market.Application.Abstractions;

// Application layer
public interface IAppDbContext
{
    DbSet<MarketUserEntity> Users { get; }

    DbSet<RefreshTokenEntity> RefreshTokens { get; }
    DbSet<CategoryEntity> Categories { get; }
    DbSet<CityEntity> Cities { get; }
    DbSet<BranchEntity> Branches { get; }
    DbSet<StoreEntity> Stores { get; }

    Task<int> SaveChangesAsync(CancellationToken ct);
}