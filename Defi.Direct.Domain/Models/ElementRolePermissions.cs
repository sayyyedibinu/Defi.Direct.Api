using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ElementRolePermissions
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public Guid ElementId { get; set; }
        public int Permission { get; set; }

        public Elements Element { get; set; }
        public Roles Role { get; set; }
    }
}
