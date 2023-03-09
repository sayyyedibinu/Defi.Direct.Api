using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Defi.Direct.Domain.Models
{
    public partial class Sites
    {
        public Guid Id { get; set; }
        public string Site { get; set; }
        public Guid ClientId { get; set; }
        public Clients Client { get; set; }
        public string ActionStatus { get; set; }
		public string CustomUrl { get; set; }
		[NotMapped]
        public bool IsPublished { get; set; }
    }
}
