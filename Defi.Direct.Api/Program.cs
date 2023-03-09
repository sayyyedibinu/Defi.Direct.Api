using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Defi.Direct.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // If this code throws an error when developing locally, you may need to
            // comment out the entire UseKestrel command below.
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateWebHostBuilder(string[] args) =>
	        Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(webBuilder =>
		    {
			    webBuilder.UseKestrel(options =>
                {
                    var configuration = (IConfiguration)options.ApplicationServices.GetService(typeof(IConfiguration));
                    var certPath = configuration.GetValue<string>("Kestrel:Certificates:Default:Path");
                    var certPassword = configuration.GetValue<string>("Kestrel:Certificates:Default:Password");

                    options.Listen(IPAddress.Any, 80);
                    options.Listen(IPAddress.Any, 443, listenOptions => listenOptions.UseHttps(certPath, certPassword));
                    options.Limits.MaxRequestBodySize = 26214400;
                });
                webBuilder.UseStartup<Startup>();
            });
    }
}