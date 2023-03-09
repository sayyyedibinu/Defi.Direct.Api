using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class PasswordConfigurations
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public DateTime? UpdateDate { get; set; }
        public DateTime CreateDate { get; set; }
        public Guid? UpdatedBy { get; set; }
        public int RequiredChars { get; set; }
        public int RequiredAlphaChars { get; set; }
        public int RequiredNumericChars { get; set; }
        public int RequiredSpecialChars { get; set; }
        public int ExpiresInDays { get; set; }
        public int MinutesToLogout { get; set; }
        public int MinutesToWarning { get; set; }

        public Clients Client { get; set; }
    }
}
