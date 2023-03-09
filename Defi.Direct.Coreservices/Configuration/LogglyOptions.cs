using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Coreservices.Configuration
{
    public class LogglyOptions
    {
        public string ApplicationName { get; set; }
        public string CustomerToken { get; set; }
        public string EndpointHostName { get; set; }
        public bool Enabled { get; set; }
        public string Tags { get; set; }
    }
}
