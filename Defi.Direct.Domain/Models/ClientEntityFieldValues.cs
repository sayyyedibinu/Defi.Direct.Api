using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ClientEntityFieldValues
    {
        public Guid Id { get; set; }
        public Guid ClientEntityFieldId { get; set; }
        public Guid RecordId { get; set; }
        public string FieldValue { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }

        public ClientEntityFields ClientEntityField { get; set; }
    }
}
