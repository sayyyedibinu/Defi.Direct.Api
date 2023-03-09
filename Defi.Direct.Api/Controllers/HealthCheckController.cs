using System.Threading.Tasks;
using Defi.Direct.Coreservices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Defi.Direct.Api.Controllers
{
    [Route("v1/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    [EnableCors("CorsPolicy")]
    public class HealthCheckController : Controller
    {
        private readonly HealthCheckOptions _healthCheckOptions;
        private readonly ILogger<HealthCheckController> _logger;

        public HealthCheckController(IOptions<HealthCheckOptions> healthCheckOptions, ILogger<HealthCheckController> logger)
        {
            _logger = logger;
            _healthCheckOptions = healthCheckOptions.Value;
        }

        /// <summary>
        /// Endpoint for liveness check (whether the web server is even up)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("healthz")]
        public IActionResult Healthz([FromQuery]string key)
        {
            //if (string.IsNullOrEmpty(key) ||
            //    !string.Equals(key, _healthCheckOptions.Key, StringComparison.InvariantCultureIgnoreCase))
            //{
            //    return Unauthorized();
            //}

            return new OkResult();
        }

        /// <summary>
        /// Endpoint for readiness check (whether we are ready to start accepting traffic and processing requests)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("readiness")]
        public async Task<IActionResult> Readiness([FromQuery]string key)
        {
            //if (string.IsNullOrEmpty(key) ||
            //    !string.Equals(key, _healthCheckOptions.Key, StringComparison.InvariantCultureIgnoreCase))
            //{
            //    return Unauthorized();
            //}

            return new OkResult();
        }
    }
}