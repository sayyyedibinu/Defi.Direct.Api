using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class EntitySnapshots
    {
        public EntitySnapshots()
        {
            SystemLogs = new HashSet<SystemLogs>();
        }

        public Guid Id { get; set; }
        public string EntityName { get; set; }
        public Guid EntityPrimaryKey { get; set; }
        public string EntityValue { get; set; }
        public DateTime CreateDate { get; set; }

        public ICollection<SystemLogs> SystemLogs { get; set; }
    }
}
