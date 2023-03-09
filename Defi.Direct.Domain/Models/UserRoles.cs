using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class UserRoles
    {
        public Guid UserId { get; set; }
        public Guid RoleId { get; set; }

        public Roles Role { get; set; }
        public Users User { get; set; }
    }
}
