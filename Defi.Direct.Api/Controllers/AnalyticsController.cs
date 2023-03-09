using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/analytics")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [EnableCors("CorsPolicy")]
    public class AnalyticsController : Controller
    {
        private directContext direct;
        private ILogger _logWriter;
        private readonly IClientService clientService;
        public AnalyticsController(directContext direct, ILogger<SiteController> logWriter, IClientService clientService)
        {
            this.direct = direct;
            _logWriter = logWriter;
            this.clientService = clientService;
        }
        [Route("geturl")]
        public async Task<IActionResult> GetAnalyticsUrl()
        {
            //need to specify direct custom attributes here
            var user_attributes = new Dictionary<string, string>();
            string _clientId = clientService.ClientId.ToString(); //"30c32352-0637-16a8-3014-37a9a0062daf"; 
            user_attributes["direct_clientid"] = _clientId;

            var config = new LookerSettings()
            {
                HostName = "defisolutions.looker.com",
                Secret = "c8cf3f68127bbddb0aed9997f91759f2c727103e85e1d87c9545bc6cce562126",
                ExternalUserId = "1435",
                UserFirstName = "defi",
                UserLastName = "DIRECT Embed",
                Permissions = new string[] { "access_data", "see_looks", "see_user_dashboards", "see_lookml_dashboards" },
                Models = new string[] { "defi_direct" },
                GroupIds = new int[] { 167 },
                ExternalGroupId = "",
                SessionLength = TimeSpan.FromSeconds(2592000),
                UserAttributeMapping = user_attributes
            };
            dynamic url = null;
            url = GetLookerEmbedUrl("/embed/dashboards/1819", config);

            return Ok(new { EmbeddedUrl = url.AbsoluteUri });
        }

        private Uri GetLookerEmbedUrl(string targetPath, LookerSettings config)
        {

            var builder = new UriBuilder
            {
                Scheme = "https",
                Host = config.HostName,
                Path = "/login/embed/" + System.Net.WebUtility.UrlEncode(targetPath)
            };

            var unixTime = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            var time = unixTime.ToString();

            var json_nonce = JsonConvert.SerializeObject(config.Nonce);
            var json_external_user_id = JsonConvert.SerializeObject(config.ExternalUserId);
            var json_permissions = JsonConvert.SerializeObject(config.Permissions);
            var json_group_ids = JsonConvert.SerializeObject(config.GroupIds);
            var json_external_group_id = JsonConvert.SerializeObject(config.ExternalGroupId);
            var json_user_attribute_values = JsonConvert.SerializeObject(config.UserAttributeMapping);
            var json_models = JsonConvert.SerializeObject(config.Models);
            var json_session_length = config.SessionLength.TotalSeconds.ToString();

            // order of elements is important
            var stringToSign = String.Join("\n", new string[] {
                builder.Uri.Authority,
                builder.Path,
                json_nonce,
                time,
                json_session_length,
                json_external_user_id,
                json_permissions,
                json_models,
                json_group_ids,
                json_external_group_id,
                json_user_attribute_values,
                config.AccessFilters
            });

            var signature = EncodeString(stringToSign, config.Secret);

            var json_first_name = JsonConvert.SerializeObject(config.UserFirstName);
            var json_last_name = JsonConvert.SerializeObject(config.UserLastName);
            var json_force_logout_login = JsonConvert.SerializeObject(config.ForceLogoutLogin);

            var qparams = new Dictionary<string, string>()
            {
                { "nonce", json_nonce },
                { "time", time },
                { "session_length", json_session_length },
                { "external_user_id", json_external_user_id },
                { "permissions", json_permissions },
                { "models", json_models },
                { "group_ids", json_group_ids },
                { "external_group_id", json_external_group_id },
                { "user_attributes", json_user_attribute_values },
                { "access_filters", config.AccessFilters},
                { "first_name", json_first_name },
                { "last_name", json_last_name },
                { "force_logout_login", json_force_logout_login },
                { "signature", signature }
            };

            builder.Query = String.Join("&", qparams.Select(kvp => kvp.Key + "=" + System.Net.WebUtility.UrlEncode(kvp.Value)));

            return builder.Uri;
        }

        private static string EncodeString(string urlToSign, string secret)
        {
            var bytes = Encoding.UTF8.GetBytes(secret);
            var stringToEncode = Encoding.UTF8.GetBytes(urlToSign);
            using (HMACSHA1 hmac = new HMACSHA1(bytes))
            {
                var rawHmac = hmac.ComputeHash(stringToEncode);
                return Convert.ToBase64String(rawHmac);
            }

        }
    }
}