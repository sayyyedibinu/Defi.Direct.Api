using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Defi.Direct.Coreservices.Configuration;
using Defi.Direct.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using OpenIddict.Validation.AspNetCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
namespace Defi.Direct.Api.Controllers
{
    [Route("api/Clients")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [EnableCors("CorsPolicy")]
    public class ClientController : Controller
    {
        private directContext direct;
        private ILogger _logWriter;
        private UserManager<ApplicationUser> userManager;
        private BuildServerCredentials buildServerCredentials;
        public ClientController(UserManager<ApplicationUser> userManager, directContext direct, IOptions<BuildServerCredentials> buildServerCredentials, ILogger<ClientController> logWriter)
        {
            this.direct = direct;
            this.userManager = userManager;
            _logWriter = logWriter;
            this.buildServerCredentials = buildServerCredentials.Value;
        }
        [HttpGet]
        public IActionResult Index()
        {
            try
            {
                List<Client> clientInfo = new List<Client>();
                var results = direct.Clients.OrderByDescending(x => x.UpdateDate).ToList();
                for (int i = 0; i <= results.Count - 1; i++)
                {
                    try
                    {
                        Client client_item = new Client();
                        client_item.Id = results[i].Id.ToString();
                        client_item.Name = results[i].Name;
                        client_item.Host = results[i].HostName;
                        client_item.IsActive = results[i].IsActive;
                        clientInfo.Add(client_item);
                    }
                    catch (Exception e)
                    {
                        _logWriter.LogWarning(e.Message);
                        
                    }
                }
                return Ok(clientInfo);
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetSpecific(string id)
        {
            try
            {
                dynamic results = (from item in direct.Clients where item.Id == Guid.Parse(id) select item).FirstOrDefault();
                return Ok(results);
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] JToken jToken)
        {
            try
            {
                dynamic clientObj = JObject.Parse(jToken.ToString());
                Guid clientId = clientObj.id;
                string clientName = clientObj.name;
                string hostName = clientObj.host;
                bool isActive = clientObj.isActive;
                dynamic clientInfo = (from item in direct.Clients where item.Name == clientName select item).FirstOrDefault();
                if (clientInfo != null)
                {
                    return StatusCode(409, "A client with name " + clientName + " already exists");
                }
                clientInfo = (from item in direct.Clients where item.HostName == hostName select item).FirstOrDefault();
                if (clientInfo != null)
                {
                    return StatusCode(409, "A client with host url " + hostName + " already exists");
                }

                Clients c = new Clients()
                {
                    Id = clientId,
                    Name = clientName,
                    HostName = hostName,
                    CreateDate = DateTime.Now,
                    UpdateDate = DateTime.Now,
                    IsActive = isActive
                };
                direct.Clients.Add(c);
                try
                {
                    await direct.SaveChangesAsync();
                    ApplicationDbInitializer.SetupUser(userManager, c.Id, "admin", "DefiPassword1234!$@", "Admin");
                    ApplicationDbInitializer.SetupUser(userManager, c.Id, "defiadmin", "defiDIRECT2019'", "Admin");
                }
                catch (Exception )
                {
                    return BadRequest();
                }
                return Ok(c.Id);
            }
            catch (Exception ex)
            {
                _logWriter.LogError(ex.Message);
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("copy")]
        public async Task<IActionResult> PostCopyAsync([FromBody] JToken jToken)
        {
            try
            {
                Dictionary<Guid, Guid> guidUpdatesForSite = new Dictionary<Guid, Guid>();
                dynamic clientObj = JObject.Parse(jToken.ToString());
                Guid newClientId = clientObj.id;
                string baseClientName = clientObj.basename;
                List<FieldLists> fieldLists = (from client in direct.Clients join centity in direct.FieldLists on client.Id equals centity.ClientId where client.Name == baseClientName select centity).ToList();
                if (fieldLists == null) {
                    return StatusCode(409, "No existing field lists to copy");
                }
                foreach (FieldLists fl in fieldLists)
                {
                    FieldLists fln = new FieldLists()
                    {
                        Id = Guid.NewGuid(),
                        ClientId = newClientId,
                        IsSystem = fl.IsSystem,
                        Name = fl.Name,
                        Order = fl.Order,
                        OrderBy = fl.OrderBy,
                        Sorted = fl.Sorted,
                        CreateDate = DateTime.Now,
                        UpdateDate = DateTime.Now
                    };
                    guidUpdatesForSite.Add(fl.Id, fln.Id);
                    direct.FieldLists.Add(fln);
                    List<FieldListItems> fieldListItems = (from item in direct.FieldListItems where item.FieldListId == fl.Id select item).ToList();
                    if (fieldListItems == null)
                    {
                        return StatusCode(409, "No existing field list items to copy");
                    }
                    foreach (FieldListItems fli in fieldListItems)
                    {
                        FieldListItems flin = new FieldListItems()
                        {
                            Id = Guid.NewGuid(),
                            Display = fli.Display,
                            FieldListId = fln.Id,
                            Ordinal = fli.Ordinal,
                            Value = fli.Value,
                            CreateDate = DateTime.Now,
                            UpdateDate = DateTime.Now
                        };
                        guidUpdatesForSite.Add(fli.Id, flin.Id);
                        direct.FieldListItems.Add(flin);
                    }
                }
                List<Rules> ruleItems = (from client in direct.Clients join centity in direct.Rules on client.Id equals centity.ClientId where client.Name == baseClientName select centity).ToList();
                if (ruleItems == null)
                {
                    return StatusCode(409, "No existing rule items to copy");
                }
                foreach (Rules r in ruleItems)
                {
                    Rules rn = new Rules()
                    {
                        Id = Guid.NewGuid(),
                        ClientId = newClientId,
                        RuleDetail = r.RuleDetail,
                        RuleName = r.RuleName,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now
                    };
                    guidUpdatesForSite.Add(r.Id, rn.Id);
                    direct.Rules.Add(rn);
                }
                List<ClientEntityFields> clientEntityList = (from client in direct.Clients join centity in direct.ClientEntityFields on client.Id equals centity.ClientId where client.Name == baseClientName select centity).ToList();
                if (clientEntityList == null)
                {
                    return StatusCode(409, "No existing fields to copy");
                }
                foreach (ClientEntityFields ce in clientEntityList)
                {
                    ClientEntityFields f = new ClientEntityFields()
                    {
                        Id = Guid.NewGuid(),
                        ClientId = newClientId,
                        Options = ce.Options,
                        CreateDate = DateTime.Now,
                        UpdateDate = DateTime.Now
                    };
                    foreach (Guid key in guidUpdatesForSite.Keys)
                    {
                        Guid value = guidUpdatesForSite[key];
                        string keyUpper = key.ToString().ToUpper();
                        string keyLower = key.ToString().ToLower();
                        string valueLower = guidUpdatesForSite[key].ToString().ToLower();
                        f.Options = f.Options.Replace(keyUpper, valueLower);
                        f.Options = f.Options.Replace(keyLower, valueLower);
                    }
                    guidUpdatesForSite.Add(ce.Id, f.Id);
                    direct.ClientEntityFields.Add(f);
                }
                List<Sites> siteList = (from client in direct.Clients join site in direct.Sites on client.Id equals site.ClientId where client.Name == baseClientName select site).ToList();
                if (siteList == null)
                {
                    return StatusCode(409, "No existing site to copy");
                }
                foreach (Sites si in siteList)
                {
                    Guid newSiteId = Guid.NewGuid();
                    dynamic newSiteInfo = JObject.Parse(si.Site.ToString());
                    newSiteInfo.id = newSiteId;
                    newSiteInfo.dtLastUpdated = DateTime.Now;
                    Sites s = new Sites()
                    {
                        Id = newSiteId,
                        ClientId = newClientId,
                        Site = newSiteInfo.ToString(),
                        CustomUrl = si.CustomUrl,
                        ActionStatus = si.ActionStatus,
                        IsPublished = si.IsPublished
                    };
                    foreach (Guid key in guidUpdatesForSite.Keys)
                    {
                        Guid value = guidUpdatesForSite[key];
                        string keyUpper = key.ToString().ToUpper();
                        string keyLower = key.ToString().ToLower();
                        string valueLower = guidUpdatesForSite[key].ToString().ToLower();
                        s.Site = s.Site.Replace(keyUpper, valueLower);
                        s.Site = s.Site.Replace(keyLower, valueLower);
                    }
                    direct.Sites.Add(s);
                }
                try
                {
                    await direct.SaveChangesAsync();
                }
                catch (Exception)
                {
                    return BadRequest();
                }
                return Ok();
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }
        [HttpPut]
        public async Task<IActionResult> PutAsync([FromBody] JToken jToken)
        {
            try
            {
                dynamic clientObj = JObject.Parse(jToken.ToString());
                Guid clientId = clientObj.id;
                string clientName = clientObj.name;
                string hostName = clientObj.host;
                bool isActive = clientObj.isActive;
                dynamic clientInfo = (from item in direct.Clients where item.Id != clientId && item.Name == clientName select item).FirstOrDefault();
                if (clientInfo != null)
                {
                    return StatusCode(409, "A client with name " + clientName + " already exists");
                }
                clientInfo = (from item in direct.Clients where item.Id != clientId && item.HostName == hostName select item).FirstOrDefault();
                if (clientInfo != null)
                {
                    return StatusCode(409, "A client with host url " + hostName + " already exists");
                }
                Clients client = (from item in direct.Clients where item.Id == clientId select item).FirstOrDefault();
                client.Name = clientName;
                client.HostName = hostName;
                client.IsActive = isActive;
                client.UpdateDate = DateTime.Now;
                try
                {
                    direct.Update(client);
                    int x = await direct.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    return BadRequest();
                }
                return Ok();
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }
    }
}