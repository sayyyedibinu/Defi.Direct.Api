using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class FieldListItems
    {
        public Guid Id { get; set; }
        public Guid FieldListId { get; set; }
        public string Display { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }
        public int Ordinal { get; set; }
		public string Value { get; set; }

		public FieldLists FieldList { get; set; }
    }
}
