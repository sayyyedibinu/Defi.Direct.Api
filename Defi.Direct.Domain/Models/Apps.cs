using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Models
{
	public partial class Apps
	{
		public Guid Id { get; set; }		
		public string BorrowerHash { get; set; }		
		public string EmailId { get; set; }
		public Guid SiteId { get; set; }
		public Guid VersionId { get; set; }
		public Guid AppId { get; set; }
		public string ApplicationNumber { get; set; }
		public string AppData { get; set; }
		public Guid ClientId { get; set; }
		public DateTime CreateDate { get; set; }
		public DateTime UpdateDate { get; set; }
		public DateTime AppSubmitDate { get; set; }
		public string DecisionData { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
        public string ClientName { get; set; }
        public string HostName { get; set; }
		public string VersionTitle { get; set; }
        public Clients Client { get; set; }

	}
}
