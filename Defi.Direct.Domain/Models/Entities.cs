using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class Entities
    {
        public Entities()
        {
        }

        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string Name { get; set; }
        public bool IsSystem { get; set; }
        public string TypeName { get; set; }
        public string Options { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }

    }
}
