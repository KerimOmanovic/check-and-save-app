using Market.Domain.Common;
using Market.Domain.Entities.StoreEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.ProductEntities
{
    public class ProductEntity : BaseEntity
    {
        public int StoreEntityId { get; set; }
        public StoreEntity?StoreEntity { get; set; }
        public int BranchEntityId { get; set; }
        public BranchEntity?BranchEntity { get; set; }
        public int CategoryEntityId { get; set; }
        public CategoryEntity?CategoryEntity { get; set; }
        public int BrandEntityId { get; set; }
        public BrandEntity?BrandEntity { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ImageURL { get; set; }
        public DateTime DateAdded { get; set; }

        public ICollection<PriceEntity> Prices { get; set; } = new List<PriceEntity>();
        public ICollection<ReviewEntity> Reviews { get; set; } = new List<ReviewEntity>();
        public ICollection<FavoritesEntity> Favorites { get; set; } = new List<FavoritesEntity>();
        public ICollection<ItemComparisonEntity> ItemComparison { get; set; } = new List<ItemComparisonEntity>();
        //public ICollection<SalesStatisticsEntity> SalesStatistics { get; set; } = new List<SalesStatisticsEntity>();
    }
}
