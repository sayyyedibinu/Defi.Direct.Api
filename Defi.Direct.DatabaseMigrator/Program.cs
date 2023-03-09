using Defi.Direct.Domain.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.PlatformAbstractions;
using System;
using System.IO;

namespace Defi.Direct.DatabaseMigrator
{
    class Program
    {

        public static int Main(string[] args)
        {               
            var webHost = new WebHostBuilder()
                .UseStartup<Startup>()
                .Build();

            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true)
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", true)
                .Build();
                        
            var parseResult = bool.TryParse(configuration.GetSection("DatabaseMigrator")["ApplyMigration"], out bool applyMigration);

            if (!parseResult || !applyMigration) return 0;

            var result = RunDbMigrations(webHost);

            Console.ForegroundColor = result == 0 ? ConsoleColor.Green : ConsoleColor.Red;
            Console.WriteLine(result == 0 ? "Success!" : "Fail!");
            Console.ResetColor();
            return result;
        }

        private static int RunDbMigrations(IWebHost webHost)
        {
            try
            {
                Console.WriteLine("Applying auth db migrations ");
                using (var authContext = (ApplicationDbContext)webHost.Services.GetService(typeof(ApplicationDbContext)))
                {
                    authContext.Database.Migrate();
                }

                Console.WriteLine("Auth db migrations done");

                Console.WriteLine("Applying direct db migrations ");
                using (var directContext = (directContext)webHost.Services.GetService(typeof(directContext)))
                {
                    directContext.Database.Migrate();
                }

                Console.WriteLine("Direct db migrations done");

                return 0;
            }
            catch (Exception e)
            {
                var message = $"Exception occurred when running migrations: {e.GetType()} {e.Message}, {e.InnerException?.Message ?? ""}";

                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(message);
                Console.WriteLine(e.StackTrace);
                Console.ResetColor();

                return 1;
            }
        }
    }
}
