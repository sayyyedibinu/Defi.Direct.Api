using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Elements.Domain;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json.Linq;
namespace Defi.Direct.Api.Controllers
{
	[Route("api/pages")]
	[ApiController]
	[EnableCors("CorsPolicy")]
    public class ValuesController : ControllerBase
	{
		private directContext directContext;
		private IClientService clientService;
        private ApplicationDbContext applicationDbContext;

		public ValuesController(directContext directContext, IClientService clientService, ApplicationDbContext applicationDbContext)
		{
			this.directContext = directContext;
			this.clientService = clientService;
            this.applicationDbContext = applicationDbContext;
		}

		// GET api/values
		[HttpGet]
		public ActionResult<IEnumerable<string>> Get()
		{
			return new string[] { "value1", "value2" };
		}

		// GET api/values/5
		[HttpGet("{id}")]
		public ActionResult<string> Get(int id)
		{
			return "value";
		}

		// POST api/values
		[HttpPost]
		public void Post([FromBody] string value)
		{
		}

		// PUT api/values/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] string value)
		{
		}

		// DELETE api/values/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}

        [HttpPost]
        [Route("save/{pageId}")]
        [AllowAnonymous]
        public async Task<IActionResult> Save(Guid pageId, [FromBody] dynamic data, string dealerIdOverride = null)
        {
            data.Id = Guid.NewGuid();
            var entity = new Dictionary<string, object>();
            string loan = data.ToString();
            JObject loanObj = JObject.Parse(loan);

            foreach (var item in loanObj)
            {
                entity[item.Key] = ((JValue)item.Value).Value;
            }

            var elements = (from item in directContext.Elements where item.Id == clientService.PageId select item).First();

            if (elements == null)
                throw new NullReferenceException("Element not found for page id: " + clientService.PageId);

            if (string.IsNullOrEmpty(elements.Options))
                return Ok();

            dynamic options = JsonConvert.DeserializeObject(elements.Options);
            string postUrl = (string)options.PostUrl;

            if (options != null && options.ContainsKey("PostUrl"))
            {

                if (options.ContainsKey("PostData"))
                {
                    JObject postData = JObject.Parse(options["PostData"].ToString());

                    if (postData != null)
                    {
                        foreach (var item in postData)
                        {
                            var value = ((JValue)item.Value).Value;

                            if (item.Key == "DealerId" && !string.IsNullOrEmpty(dealerIdOverride))
                            {
                                value = dealerIdOverride;
                            }

                            if (!entity.ContainsKey(item.Key))
                                entity.Add(item.Key, value);
                            else
                            {
                                entity[item.Key] = ((JValue)item.Value).Value;
                            }
                        }
                    }
                }

                XmlBuilder builder = new XmlBuilder(entity, "loan-application", new[]{
                    "ClientId",
                    "TypeName",
                    "Id",
                    "CorrelationId",
                    "CreateDate",
                    "UpdateDate",
                    "UpdatedBy",
                    "EntityName",
                    "NonFieldContent%"
                });
                var xml = builder.GetXml();
                var httpClient = new BasicHttpClient(options["PostUrl"].ToString());
                var results = await httpClient.PostXml(xml);
                XmlDocument document = new XmlDocument();
                document.LoadXml(results);
                XmlNode newRoot = document.CreateElement("Results");

                if (document.DocumentElement != null)
                {
                    foreach (XmlNode childNode in document.DocumentElement.ChildNodes)
                    {
                        newRoot.AppendChild(childNode.CloneNode(true));
                    }
                    return Ok(newRoot);
                }
            }
            return Ok("ERROR");
        }

    }

	}
