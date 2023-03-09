using System;
using System.Linq;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Cors;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/Rules")]
	[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
	[ApiController]
    [EnableCors("CorsPolicy")]
	public class RulesController : ControllerBase
    {

		private directContext direct;
		private ILogger _logWriter;
		private readonly IClientService clientService;
		public RulesController(directContext direct, ILogger<SiteController> logWriter, IClientService clientService)
		{
			this.direct = direct;
			_logWriter = logWriter;
			this.clientService = clientService;
		}

		// GET: /<controller>/
		[HttpGet]
		public IActionResult Index()
		{
			try
			{
				var results = (from item in direct.Rules where item.ClientId == clientService.ClientId select new { item.Id, item.ClientId, item.RuleName, RuleDetail = JsonConvert.DeserializeObject(item.RuleDetail), item.CreatedDate, item.UpdatedDate }).ToList().OrderByDescending (item => item.UpdatedDate);
				//var sortedResult = from item in results select new { item.Id, item.Options };
				return Ok(results);
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
				var results = (from item
							  in direct.Rules
							   where item.ClientId == clientService.ClientId && item.Id == new Guid(id)
							   select new { item.Id, item.ClientId, item.RuleName, RuleDetail = JsonConvert.DeserializeObject(item.RuleDetail), item.CreatedDate, item.UpdatedDate }).FirstOrDefault();
				return Ok(results);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> PostAsync([FromBody] JToken jToken)
		{
			try
			{
				dynamic ruleObj = JObject.Parse(jToken.ToString());
				
				string id = ruleObj.id;
				string ruleName = ruleObj.ruleName;
				dynamic ruleDetails = ruleObj.ruleDetail;

				bool existsRuleName = ValidateRuleName(ruleName, id);
				if (existsRuleName)
				{
					return StatusCode(409, "A rule with name " + ruleName + " already exists");
				}

				var ruleInfo = (from item in direct.Rules where item.Id == Guid.Parse(id.ToString()) select item).Count();
			
				if (ruleInfo == 0)
				{
					Rules s = new Rules() { Id = ruleObj.id, ClientId = clientService.ClientId, RuleName = ruleObj.ruleName, RuleDetail = JsonConvert.SerializeObject(ruleDetails), CreatedDate = DateTime.Now, UpdatedDate = DateTime.Now };
					direct.Rules.Add(s);					
				}
				else
				{
					Rules rule = (from item in direct.Rules.AsNoTracking() where item.Id == Guid.Parse(id.ToString()) select item).FirstOrDefault();
					rule.RuleName = ruleName;
					rule.RuleDetail = JsonConvert.SerializeObject(ruleDetails);
					rule.UpdatedDate = DateTime.Now;
					direct.Rules.Update(rule);
				}
				try
				{
					await direct.SaveChangesAsync();
				}
				catch (Exception )
				{
					return BadRequest();
				}

				return Ok(id);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[HttpDelete]
		[Route("{id}")]
		public IActionResult Delete(string id)
		{
			try
			{
				Guid Id = Guid.Parse(id);
				Rules s = new Rules() { Id = Id };
				direct.Rules.Attach(s);
				direct.Rules.Remove(s);
				direct.SaveChanges();

				return Ok();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		public bool ValidateRuleName(string newRuleName,string id)
		{
			
			var fieldNameCnt = direct.Rules.Where(x => x.RuleName.ToLower() == newRuleName.ToLower() && x.Id != new Guid(id) && x.ClientId == clientService.ClientId).Count();

			if (fieldNameCnt >= 1)
				return true;
			else
				return false; ;

		}
		
	}
}