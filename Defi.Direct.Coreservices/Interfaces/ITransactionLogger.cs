using Defi.Direct.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Defi.Direct.Coreservices.Interfaces
{
    public interface ITransactionLogger
    {
        void Create(DataLog transaction);
        void Create(Apps transaction);
    }
}
