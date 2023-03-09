using Defi.Direct.Coreservices.Configuration;
using Defi.Direct.Services.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Services
{
    public class MockClientService : IClientService
    {
        private MockClientConfiguration mockClientConfiguration;
        public MockClientService(IOptions<MockClientConfiguration> options)
        {
            mockClientConfiguration = options.Value ?? new MockClientConfiguration() { ClientId = Guid.Empty, PageId = Guid.Empty };
        }
        public Guid ClientId
        {
            get
            {
                return mockClientConfiguration.ClientId;
            }
        }
        public Guid PageId
        {
            get
            {
                return mockClientConfiguration.PageId;
            }

        }
    }
}
