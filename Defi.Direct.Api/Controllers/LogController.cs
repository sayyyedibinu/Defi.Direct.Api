using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/Log")]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class LogController : ControllerBase
    {
        private ILogger _logWriter;
        public LogController(ILogger<LogController> logWriter)
        {
            _logWriter = logWriter;
        }

        [HttpPost]
        [Route("Error")]
        public async Task<IActionResult> PostErrorAsync([FromBody] JToken jToken)
        {
            Log(LogLevel.Error, (JObject)jToken);
            return Ok();
        }

        [HttpPost]
        [Route("Warning")]
        public async Task<IActionResult> PostWarningAsync([FromBody] JToken jToken)
        {
            Log(LogLevel.Warning, (JObject)jToken);
            return Ok();
        }

        [HttpPost]
        [Route("{level}")]
        public async Task<IActionResult> PostLogAsync(int level, [FromBody] JToken jToken)
        {
            Log((LogLevel)level, (JObject)jToken);
            return Ok();
        }

        private void Log(LogLevel level, JObject body)
        {
            _logWriter.Log(level, body.ToString(Formatting.None));
        }
    }
}