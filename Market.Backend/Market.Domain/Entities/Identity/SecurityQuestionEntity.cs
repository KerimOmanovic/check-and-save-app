using Market.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.Identity
{
    public class SecurityQuestionEntity : BaseEntity
    {
        public int MarketUserEntityId { get; set; }

        public MarketUserEntity? MarketUserEntity { get; set; }
        public string Question { get; set; } = null!;
        public string Answer { get; set; } = null!;
    }
}
