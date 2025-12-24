using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.ProductEntities
{
    public class CategoryEntity : BaseEntity
    {
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}