using System;
using System.Collections.Generic;

namespace Defi.Direct.Domain.Models
{
    public partial class Elements
    {
        public Elements()
        {
            //ClientsDefaultAccountPage = new HashSet<Clients>();
            //ClientsDefaultEntryPage = new HashSet<Clients>();
            ElementEntityFields = new HashSet<ElementEntityFields>();
            ElementRolePermissions = new HashSet<ElementRolePermissions>();
            ElementUserPermissions = new HashSet<ElementUserPermissions>();
        }

        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public string Name { get; set; }
        public string Tag { get; set; }
        public Guid? ParentId { get; set; }
        public int Ordinal { get; set; }
        public int ElementTypeId { get; set; }
        public string Options { get; set; }
        public bool IsSystem { get; set; }
        public bool IsStatic { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public Guid? UpdatedBy { get; set; }

        public Clients Client { get; set; }
        //public ICollection<Clients> ClientsDefaultAccountPage { get; set; }
        //public ICollection<Clients> ClientsDefaultEntryPage { get; set; }
        public ICollection<ElementEntityFields> ElementEntityFields { get; set; }
        public ICollection<ElementRolePermissions> ElementRolePermissions { get; set; }
        public ICollection<ElementUserPermissions> ElementUserPermissions { get; set; }
    }
}
