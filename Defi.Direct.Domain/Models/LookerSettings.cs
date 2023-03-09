using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Models
{
    public class LookerSettings
    {
        public string AccessFilters { get; set; }
        public string ExternalUserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public bool ForceLogoutLogin { get; set; }
        public string[] Models { get; set; }
        public int[] GroupIds { get; set; }
        public string ExternalGroupId { get; set; }
        public string[] Permissions { get; set; }
        public Dictionary<string, string> UserAttributeMapping { get; set; }
        public string Secret { get; set; }
        public TimeSpan SessionLength { get; set; }
        public string HostName { get; set; }
        public int HostPort { get; set; }
        public string Nonce { get; set; }
        public string UserAttr { get; set; }

        public LookerSettings()
        {
            ForceLogoutLogin = true;
            SessionLength = TimeSpan.FromMinutes(15);
            Nonce = DateTime.Now.Ticks.ToString();
            UserAttr = "{}";
            AccessFilters = "{}";
        }
    }
}
