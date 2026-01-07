using Market.Application.Abstractions;
using Market.Domain.Entities.ProductEntities;
using Market.Domain.Entities.StoreEntities;

namespace Market.Infrastructure.Database;

public partial class DatabaseContext : DbContext, IAppDbContext
{
    public DbSet<MarketUserEntity> Users => Set<MarketUserEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();

    public DbSet<CategoryEntity> Categories => Set<CategoryEntity>();
    public DbSet<BrandEntity> Brands => Set<BrandEntity>();
    public DbSet<ComparisonEntity> Comparisons => Set<ComparisonEntity>();
    public DbSet<FavoritesEntity> Favorites => Set<FavoritesEntity>();
    public DbSet<ItemComparisonEntity> ItemComparasions => Set<ItemComparisonEntity>();
    public DbSet<PriceEntity> Prices => Set<PriceEntity>();
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<ReviewEntity> Reviews => Set<ReviewEntity>();
    public DbSet<CityEntity> Cities => Set<CityEntity>();
    public DbSet<StoreEntity> Stores => Set<StoreEntity>();
    public DbSet<BranchEntity> Branches => Set<BranchEntity>();

    public DbSet<ItemComparisonEntity> ItemComparisons => throw new NotImplementedException();

    public DbSet<ActivityEntity> Activities => throw new NotImplementedException();

    public DbSet<ManagerEntity> Managers => throw new NotImplementedException();

    public DbSet<PublicUserEntity> PublicUsers => throw new NotImplementedException();

    public DbSet<SecurityQuestionEntity> SecurityQuestions => throw new NotImplementedException();

    private readonly TimeProvider _clock;

    public DatabaseContext(DbContextOptions<DatabaseContext> options, TimeProvider clock) : base(options)
    {
        _clock = clock;
    }
}