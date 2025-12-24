using Market.Domain.Entities.ProductEntities;

namespace Market.Application.Abstractions;

// Application layer
public interface IAppDbContext
{
    DbSet<MarketUserEntity> Users { get; }

    DbSet<RefreshTokenEntity> RefreshTokens { get; }
    DbSet<CategoryEntity> Categories { get; }

    Task<int> SaveChangesAsync(CancellationToken ct);
}