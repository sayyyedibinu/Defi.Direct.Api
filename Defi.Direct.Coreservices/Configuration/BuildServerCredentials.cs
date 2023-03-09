using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Coreservices.Configuration
{
    public class BuildServerCredentials
    {
        public bool useBuildServer { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string url { get; set; }
    }
}
