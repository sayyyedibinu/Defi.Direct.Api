using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Models
{
	public partial class Rules
	{
		public Guid Id { get; set; }
		public Guid ClientId { get; set; }
		public string RuleName { get; set; }
		public string RuleDetail { get; set; }
		public DateTime CreatedDate { get; set; }
		public DateTime UpdatedDate { get; set; }

		public Clients Client { get; set; }
	}
}
