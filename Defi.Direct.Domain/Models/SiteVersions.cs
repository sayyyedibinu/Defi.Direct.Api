using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Models
{
    public partial class SiteVersions
    {
        public Guid Id { get; set; }
        public Guid SiteId { get; set; }
        public string SiteOptions { get; set; }
        public string Title { get; set; }
        public string Comments { get; set; }
        public string Version { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool Active { get; set; }
    }
}
