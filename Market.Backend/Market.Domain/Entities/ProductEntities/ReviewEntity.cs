using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.ProductEntities
{
    public class ReviewEntity : BaseEntity
    {
        public int CustomerEntityId { get; set; }
        //public CustomerEntity? CustomerEntity { get; set;}
        public int ProductEntityId { get; set; }
        public ProductEntity? ProductEntity { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime Date {  get; set; }

    }
}
