using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class SystemLogs
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public Guid ChangesetId { get; set; }
        public string EntityName { get; set; }
        public string SystemActivity { get; set; }
        public string ChangeType { get; set; }
        public string PrimaryKeyValue { get; set; }
        public string Section { get; set; }
        public string Page { get; set; }
        public string PropertyName { get; set; }
        public string IpAddress { get; set; }
        public string UpdateFrom { get; set; }
        public string UpdateTo { get; set; }
        public DateTime? UpdateDate { get; set; }
        public Guid UserId { get; set; }
        public Guid EntitySnapshotId { get; set; }
        public string ChangeCategory { get; set; }
        public string ChangeFor { get; set; }

        public EntitySnapshots EntitySnapshot { get; set; }
        public Users User { get; set; }
    }
}
