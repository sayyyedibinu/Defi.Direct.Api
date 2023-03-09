using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ThemeConfigurations
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string LoginHelpText { get; set; }
        public byte[] Logo { get; set; }
        public byte[] LoginBackground { get; set; }
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set; }
        public string TertiaryColor { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }

        public Clients Client { get; set; }
    }
}
