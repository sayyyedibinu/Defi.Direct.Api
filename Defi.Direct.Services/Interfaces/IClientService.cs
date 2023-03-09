using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Services.Interfaces
{
    public interface IClientService
    {
        Guid ClientId { get; }
        Guid PageId { get; }
    }
}
