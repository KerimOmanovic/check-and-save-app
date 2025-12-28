using Market.Application.Abstractions;
using Market.Domain.Entities.ProductEntities;
using Market.Domain.Entities.StoreEntities;

namespace Market.Infrastructure.Database;

public partial class DatabaseContext : DbContext, IAppDbContext
{
    public DbSet<MarketUserEntity> Users => Set<MarketUserEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();

    public DbSet<CategoryEntity> Categories => Set<CategoryEntity>();
    public DbSet<CityEntity> Cities => Set<CityEntity>();
    public DbSet<StoreEntity> Stores => Set<StoreEntity>();
    public DbSet<BranchEntity> Branches => Set<BranchEntity>();

    private readonly TimeProvider _clock;

    public DatabaseContext(DbContextOptions<DatabaseContext> options, TimeProvider clock) : base(options)
    {
        _clock = clock;
    }
}