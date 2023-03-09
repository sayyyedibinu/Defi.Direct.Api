using Defi.Direct.Domain.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace Defi.Direct.DatabaseMigrator
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true)
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", true);              
            Configuration = builder.Build();
            _env = env;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionStringDirect = Configuration.GetSection("ConnectionStrings")["MySqlDirectConnectionString"];
            var serverVersion = ServerVersion.AutoDetect(connectionStringDirect);

            services.AddScoped<directContext>();
            services.AddScoped<ApplicationDbContext>();

            services.AddDbContext<directContext>(
             dbContextOptions => dbContextOptions
              .UseMySql(connectionStringDirect, serverVersion)
              .EnableSensitiveDataLogging());

            if (_env.IsDevelopment())
            {
                services.AddDbContext<directContext>(dbContextOptions =>
                    dbContextOptions.EnableDetailedErrors());
            }

            var connectionStringDirectAuth = Configuration.GetSection("ConnectionStrings")["MySqlDirectAuthConnectionString"];
            var serverVersionAuth = ServerVersion.AutoDetect(connectionStringDirectAuth);
            services.AddDbContext<ApplicationDbContext>(
                dbContextOptions =>
                    dbContextOptions
                    .UseMySql(connectionStringDirectAuth, serverVersionAuth)
                    .EnableSensitiveDataLogging()
                    .UseOpenIddict());

            if (_env.IsDevelopment())
            {
                services.AddDbContext<ApplicationDbContext>(
                    dbContextOptions => dbContextOptions.EnableDetailedErrors());
            }
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {

            }
        }
    }
}
