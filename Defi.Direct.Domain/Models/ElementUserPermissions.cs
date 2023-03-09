using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ElementUserPermissions
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ElementId { get; set; }
        public int Permission { get; set; }

        public Elements Element { get; set; }
        public Users User { get; set; }
    }
}
