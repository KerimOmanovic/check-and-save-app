using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.StoreEntities
{
    public class StoreEntity : BaseEntity
    {
        public string Name { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public int CityId { get; set; }
        //public CityEntity? City { get; set; }
    }
}