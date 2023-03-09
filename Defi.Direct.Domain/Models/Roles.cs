using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class Roles
    {
        public Roles()
        {
            ElementRolePermissions = new HashSet<ElementRolePermissions>();
            RolePermissions = new HashSet<RolePermissions>();
            UserRoles = new HashSet<UserRoles>();
        }

        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string Name { get; set; }

        public ICollection<ElementRolePermissions> ElementRolePermissions { get; set; }
        public ICollection<RolePermissions> RolePermissions { get; set; }
        public ICollection<UserRoles> UserRoles { get; set; }
    }
}
