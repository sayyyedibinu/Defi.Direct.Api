using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class Users : IdentityUser<Guid>
    {
        public Users()
        {
            ElementUserPermissions = new HashSet<ElementUserPermissions>();
            SystemLogs = new HashSet<SystemLogs>();
            UserRoles = new HashSet<UserRoles>();
        }

		public bool IsActive { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Extension { get; set; }
        public string Fax { get; set; }
        public string AgentId { get; set; }
        public DateTime? LockoutEndDateUtc { get; set; }
        public Guid ClientId { get; set; }
        public DateTime? PasswordUpdateDate { get; set; }

        public ICollection<ElementUserPermissions> ElementUserPermissions { get; set; }
        public ICollection<SystemLogs> SystemLogs { get; set; }
        public ICollection<UserRoles> UserRoles { get; set; }
    }
}
