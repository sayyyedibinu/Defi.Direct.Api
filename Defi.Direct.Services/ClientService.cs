using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace Defi.Direct.Services
{
    public class ClientService : IClientService
    {
        private directContext direct;
        private HttpContext http;
        private Guid clientId;
        public ClientService(directContext direct, HttpContext http)
        {
            this.direct = direct;
            this.http = http;
        }
        public Guid ClientId
        {
            get
            {
                if(this.clientId == Guid.Empty)
                {
                    try
                    {
                        string clientIdString = (from item in this.http.Request.Query
                                                 where item.Key == "ClientId"
                                                 select item.Value.FirstOrDefault()).FirstOrDefault();
                        if (clientIdString != null)
                        {
                            Guid clientId = new Guid(clientIdString);
                            this.clientId = clientId;
                            return this.clientId;
                        }
                        string referer = this.http.Request.Headers["Referer"].ToString();
                        Uri uri = new Uri(referer);
                        this.clientId = (from item in this.direct.Clients where item.HostName == uri.Host select item.Id).FirstOrDefault();

                    }
                    catch (Exception) { }
                    if (this.clientId == Guid.Empty)
                        this.clientId = new Guid("FA93B8F3-1925-49BF-8F8A-C793CB87A6C8");
                }
                return this.clientId;
            }
        }

        public Guid PageId
        {
            get
            {
                return new Guid("28724a3d-d8f7-4d69-8e42-0ab53ece9977");
            }
        }
    }
}
