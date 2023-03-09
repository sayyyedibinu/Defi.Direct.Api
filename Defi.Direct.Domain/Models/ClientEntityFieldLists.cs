using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ClientEntityFieldLists
    {
        public Guid Id { get; set; }
        public Guid ClientEntityFieldId { get; set; }
        public Guid FieldListId { get; set; }

        public ClientEntityFields ClientEntityField { get; set; }
        public FieldLists FieldList { get; set; }
    }
}
