using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.StoreEntities
{
    public class CityEntity : BaseEntity
    {
        public string Name { get; set; }
        public int PostalCode { get; set; }
    }
}