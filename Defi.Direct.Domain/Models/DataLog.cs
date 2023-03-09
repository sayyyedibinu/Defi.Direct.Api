using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Models
{
    public partial class DataLog
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string ClientPageUrl { get; set; }
        public DateTime TimeStamp { get; set; }
        public string RequestStatus { get; set; }
        public Guid AppId { get; set; }
        public string ErrorSummary { get; set; }
		public Guid VersionId { get; set; }
		public bool FromPreview { get; set; }
		public bool Active { get; set; }
        public bool Published { get; set; }
		public string AppSubmitURL { get; set; }
		public string ApplicationNumber { get; set; }
        public string ClientName { get; set; }
        public string HostName { get; set; }
		public string VersionTitle { get; set; }

    }
}
