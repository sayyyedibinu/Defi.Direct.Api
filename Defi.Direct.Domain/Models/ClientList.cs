using System;
using System.Collections.Generic;
using System.Text;
namespace Defi.Direct.Domain.Models
{
    public class ClientList
    {
        public string Id { get; set; }
        public DateTime UpdatedDt { get; set; }
    }
    public class Client
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Host { get; set; }
        public bool IsActive { get; set; }
    }
}