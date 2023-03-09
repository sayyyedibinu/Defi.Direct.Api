using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Domain.Interfaces
{
    public interface ISiteDomain
    {
        List<JObject> GetSites();
        JObject GetSite(Guid guid);
        void PutSite(JObject site);
        Guid PostSites(JObject site);
    }
}
