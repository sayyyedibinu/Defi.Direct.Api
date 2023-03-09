using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class RolePermissions
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public int Permission { get; set; }

        public Roles Role { get; set; }
    }
}
