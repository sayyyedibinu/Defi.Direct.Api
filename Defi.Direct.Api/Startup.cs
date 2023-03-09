using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Serilog;
using Serilog.Core;
using Loggly.Config;
using Loggly;
using Defi.Direct.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Defi.Direct.Services.Interfaces;
using Defi.Direct.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Defi.Direct.Coreservices.Configuration;
using Amazon.S3;
using Defi.Direct.Coreservices.Interfaces;
using Defi.Direct.Coreservices;
using Microsoft.Extensions.Hosting;
using OpenIddict.Validation.AspNetCore;
using Defi.Shared.Core.Monitoring;
using Defi.Shared.Core.Logging;
using Defi.Shared.Core.Options;
using System.Collections.Generic;
using DataDogOptions = Defi.Direct.Coreservices.Configuration.DataDogOptions;
using Serilog.Events;

namespace Defi.Direct.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration,IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }
        private readonly IWebHostEnvironment _env;
        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var connectionStringDirect = Configuration.GetSection("ConnectionStrings")["MySqlDirectConnectionString"];
            var serverVersion = ServerVersion.AutoDetect(connectionStringDirect);
			
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

            services.AddCors(options =>
			{
				options.AddPolicy("CorsPolicy",
					builder =>
                    {
                        builder.SetIsOriginAllowed(isOriginAllowed: _ => true).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                    });
			});

			// Register the Identity services.
			services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddSignInManager<SignInManager<ApplicationUser>>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            
            // Register the OpenIddict services.
            services.AddOpenIddict()
	            .AddCore(options =>
                {
                    options.UseEntityFrameworkCore()
                        .UseDbContext<ApplicationDbContext>();
                })
                .AddServer(options =>
                {
                    options.SetTokenEndpointUris("/connect/token");
                    
                    // Allow client applications to use the grant_type=password flow.
                    options.AllowPasswordFlow()
	                       .AllowRefreshTokenFlow()
	                       .SetRefreshTokenLifetime(TimeSpan.FromMinutes(3600))
						   .SetAccessTokenLifetime(TimeSpan.FromMinutes(20));

                    options.AddEphemeralEncryptionKey()
							.AddEphemeralSigningKey();

                    options.UseAspNetCore()
	                    .EnableAuthorizationEndpointPassthrough()
	                    .EnableLogoutEndpointPassthrough()
	                    .EnableTokenEndpointPassthrough()
	                    .DisableTransportSecurityRequirement();

					options.AcceptAnonymousClients();
					options.DisableScopeValidation()
						   .IgnoreEndpointPermissions()
						   .IgnoreGrantTypePermissions()
						   .IgnoreScopePermissions()
						   .DisableAccessTokenEncryption();
                })
                .AddValidation(options =>
                {
                   options.UseSystemNetHttp();
                   options.UseAspNetCore();
                   options.UseLocalServer();
                });
		
            services.AddAuthentication(options =>
			{
				options.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
				options.DefaultAuthenticateScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
			});

            services.AddControllers()
	            .AddNewtonsoftJson(options =>
	            {
		            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
	            })
	            .AddXmlSerializerFormatters()
	            .AddXmlDataContractSerializerFormatters()
	            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            var credentials = Configuration.GetSection("Credentials");
            services.Configure<Credentials>(credentials);

            services.AddDefaultAWSOptions(Configuration.GetAWSOptions());
            services.AddAWSService<IAmazonS3>();

            var encryptionSettings = Configuration.GetSection("Encryption");
            services.Configure<AESEncryptionOptions>(encryptionSettings);

            var buildServerSettings = Configuration.GetSection("BuildServerCredentials");
            services.Configure<BuildServerCredentials>(buildServerSettings);

            var s3BucketSettings = Configuration.GetSection("S3");
            services.Configure<S3Configuration>(s3BucketSettings);

            var configKeySettings = Configuration.GetSection("ConfigKeySettings");
            services.Configure<ConfigSettingKeys>(configKeySettings);

            services.Configure<DataDogOptions>(Configuration.GetSection("DataDogOptions"));
            services.AddSingleton(typeof(ILoggerWrapper<>), typeof(LoggerWrapper<>));
            services.AddSingleton<IMonitor, DataDogMonitor>();

            ConfigureDataDog();

            if (_env.IsDevelopment())
            {
				var mockClientSettings = Configuration.GetSection("MockClientConfiguration");
				services.Configure<MockClientConfiguration>(mockClientSettings);
				services.AddScoped<IClientService, MockClientService>();
            }
            else
                services.AddScoped<IClientService, ClientService>();

            services.AddScoped<ITransactionLogger, S3TransactionLogger>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IEncryptionService, AESEncryptionService>();
            services.AddScoped(sp => sp.GetRequiredService<IHttpContextAccessor>().HttpContext);
           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext applicationDbContext)
        {
          if (env.IsDevelopment())
          {
	          app.UseDeveloperExceptionPage(); 
          }

          var dataDogOptions = Configuration.GetSection(nameof(DataDogOptions)).Get<DataDogOptions>();
          if (dataDogOptions.Enabled)
          {
              var loggingConfiguration = ConfigureLogging(dataDogOptions);
              Log.Logger = loggingConfiguration.CreateLogger();
          }
          else
          {
              SetupLogglyConfiguration();
              Log.Logger = CreateLogger();                
          }
          loggerFactory.AddSerilog();

          var logger = loggerFactory.CreateLogger<Startup>();
          logger.LogInformation("Defi-Direct is up and running");

          app.UseForwardedHeaders();  
          app.UseRouting();
          app.UseCors("CorsPolicy");
          app.UseAuthentication();
          app.UseAuthorization();
          app.UseEndpoints(x => x.MapControllers());
          //RegisterClientApplication(app);
          ApplicationDbInitializer.SeedRoles(roleManager);
          ApplicationDbInitializer.SeedUsers(userManager);
        } 
        
        private Logger CreateLogger()
        {
            return new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .CreateLogger();
        }

        private void SetupLogglyConfiguration()
        {
            var logglyOptions = Configuration.GetSection(nameof(LogglyOptions)).Get<LogglyOptions>();

            if (!logglyOptions.Enabled) return;

            var config = LogglyConfig.Instance;
            config.CustomerToken = logglyOptions.CustomerToken;
            config.ApplicationName = logglyOptions.ApplicationName;
            config.Transport = new TransportConfiguration
            {
                EndpointHostname = logglyOptions.EndpointHostName,
                EndpointPort = 443,
                LogTransport = LogTransport.Https
            };
            config.ThrowExceptions = true;

            //Define Tags sent to Loggly
            config.TagConfig.Tags.AddRange(new ITag[]{
                new ApplicationNameTag {Formatter = "application-{0}"},
                new HostnameTag { Formatter = "host-{0}" }
            });

            var environment = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (!string.IsNullOrEmpty(environment))
            {
                config.TagConfig.Tags.Add(new SimpleTag { Value = environment });
            }

            if (!string.IsNullOrEmpty(logglyOptions.Tags))
            {
                var logglyTags = logglyOptions.Tags.Split(",");

                if (!logglyTags.Any())
                    return;

                config.TagConfig.Tags.AddRange(logglyTags.Where(t => !string.IsNullOrEmpty(t)).Select(x => new SimpleTag { Value = x }));
            }
        }

        private LoggerConfiguration ConfigureLogging(DataDogOptions datadogOptions)
        {
            // Since we can't disable Datadog logging thru it's built-in configuration options, we have to do it here with our own IOptions.
            if (!datadogOptions.Enabled)
                return new LoggerConfiguration().ReadFrom.Configuration(Configuration);

            var tags = new List<string>();

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (!string.IsNullOrEmpty(environment))
            {
                tags.Add($"environment:{environment}");
                tags.Add($"major environment:{(environment.ToLower() == "staging" ? "int" : environment.ToLower())}");
                tags.Add($"role:api");
                tags.Add($"product:los");
            }
            if (!string.IsNullOrEmpty(datadogOptions.Tags))
            {
                var customTags = datadogOptions.Tags.Split(",");

                if (customTags.Any())
                    tags.AddRange(customTags.Where(t => !string.IsNullOrEmpty(t)));
            }

            // Add and configure the Datadog logging sink if enabled
            return new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .WriteTo.DatadogLogs(datadogOptions.ApiKey,
                    "csharp", // This corresponds to the integration name: the technology from which the log originated.  `csharp` is an existing Datadog integration from https://docs.datadoghq.com/logs/faq/integration-pipeline-reference/
                    datadogOptions.Service, // The name of the application or service generating the log events. It is used to switch from Logs to APM, so make sure you define the same value when you use both products.  This matches the New Relic service name currently.
                    logLevel: LogEventLevel.Information,
                    tags: tags.ToArray());
        }

        private void ConfigureDataDog()
        {
            if (!bool.TryParse(Configuration[$"{nameof(DataDogOptions)}:{nameof(DataDogOptions.Enabled)}"], out var enabled))
                return;

            if (!enabled) return;

            var server = Configuration[$"{nameof(DataDogOptions)}:{nameof(DataDogOptions.ServerName)}"];
            if (!int.TryParse(Configuration[$"{nameof(DataDogOptions)}:{nameof(DataDogOptions.Port)}"], out var port))
                port = 8125;

            var prefix = Configuration[$"{nameof(DataDogOptions)}:{nameof(DataDogOptions.Service)}"];
            DataDogMonitor.Configure(server, port, prefix);
        }
    }
}
