using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class ClientEntityFields
    {
        public ClientEntityFields()
        {
            ClientEntityFieldLists = new HashSet<ClientEntityFieldLists>();
            ClientEntityFieldValues = new HashSet<ClientEntityFieldValues>();
            ElementEntityFields = new HashSet<ElementEntityFields>();
        }

        public Guid Id { get; set; }
        public Guid? ClientId { get; set; }
        public string Options { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }

        public ICollection<ClientEntityFieldLists> ClientEntityFieldLists { get; set; }
        public ICollection<ClientEntityFieldValues> ClientEntityFieldValues { get; set; }
        public ICollection<ElementEntityFields> ElementEntityFields { get; set; }
    }
}
