using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.StoreEntities
{
    public class BranchEntity : BaseEntity
    {
        public int StoreEntityId { get; set; }
        public StoreEntity? StoreEntity { get; set; }
        public int CityEntityId { get; set; }
        public CityEntity? CityEntity { get; set; }
        public string Address { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }
}