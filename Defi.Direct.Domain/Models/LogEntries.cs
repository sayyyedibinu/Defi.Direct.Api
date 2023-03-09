using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class LogEntries
    {
        public Guid Id { get; set; }
        public int EntryType { get; set; }
        public string Message { get; set; }
        public string Route { get; set; }
        public string IpAddress { get; set; }
        public Guid ClientId { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
