using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.Identity
{
    public class ActivityEntitiy : BaseEntity
    {
        public int MarketUserEntityId { get; set; }
        public MarketUserEntity?MarketUserEntity { get; set; }
        public string ActivityType { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Date {  get; set; }
    }
}
