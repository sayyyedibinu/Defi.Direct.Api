using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class Clients
    {
        public Clients()
        {
            Elements = new HashSet<Elements>();
            FieldLists = new HashSet<FieldLists>();
            PasswordConfigurations = new HashSet<PasswordConfigurations>();
            ThemeConfigurations = new HashSet<ThemeConfigurations>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LegalName { get; set; }
        public string CommonName { get; set; }
        public string HostName { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string ContactFaxNumber { get; set; }
        public bool IsActive { get; set; }
        //public Guid? DefaultEntryPageId { get; set; }
        //public Guid? DefaultAccountPageId { get; set; }

        //public Elements DefaultAccountPage { get; set; }
        //public Elements DefaultEntryPage { get; set; }
        public ICollection<Elements> Elements { get; set; }
        public ICollection<FieldLists> FieldLists { get; set; }
        public ICollection<PasswordConfigurations> PasswordConfigurations { get; set; }
        public ICollection<ThemeConfigurations> ThemeConfigurations { get; set; }
        public ICollection<Sites> Sites { get; set; }
		public ICollection<Rules> Rules { get; set; }		
		public ICollection<Apps> Apps { get; set; }
	}
}
