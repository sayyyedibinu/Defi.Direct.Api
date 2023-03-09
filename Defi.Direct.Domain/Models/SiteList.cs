using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Models
{


	public class SiteList
	{
		public string Id { get; set; }
		public DateTime UpdatedDt { get; set; }
		public Site site { get; set; }
        public bool IsPublished { get; set; }
		public string CustomUrl { get; set; }
	}

	public class Site
	{
		public string title { get; set; }
	}
}
