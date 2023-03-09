using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class UserLogins
    {
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
        public Guid UserId { get; set; }
    }
}
