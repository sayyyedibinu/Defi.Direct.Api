using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class FieldLists
    {
        public FieldLists()
        {
            ClientEntityFieldLists = new HashSet<ClientEntityFieldLists>();
            FieldListItems = new HashSet<FieldListItems>();
        }

        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public bool IsSystem { get; set; }
        public string Name { get; set; }
        public bool Sorted { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string Order { get; set; }
        public string OrderBy { get; set; }

        public Clients Client { get; set; }
        public ICollection<ClientEntityFieldLists> ClientEntityFieldLists { get; set; }
        public ICollection<FieldListItems> FieldListItems { get; set; }
    }
}
