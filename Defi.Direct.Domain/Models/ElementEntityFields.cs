using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ElementEntityFields
    {
        public Guid Id { get; set; }
        public Guid ElementId { get; set; }
        public Guid ClientEntityFieldId { get; set; }
        public string Options { get; set; }
        public int Ordinal { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }

        public ClientEntityFields ClientEntityField { get; set; }
        public Elements Element { get; set; }
    }
}
