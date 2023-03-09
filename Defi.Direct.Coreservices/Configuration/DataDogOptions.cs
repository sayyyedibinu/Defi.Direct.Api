using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Coreservices.Configuration
{
    public class DataDogOptions
    {
        public bool Enabled { get; set; }

        public string ServerName { get; set; } = "127.0.0.1";

        public int Port { get; set; } = 8125;        

        public string Tags { get; set; } 

        public string Service { get; set; }

        public string ApiKey { get; set; }

    }
}

