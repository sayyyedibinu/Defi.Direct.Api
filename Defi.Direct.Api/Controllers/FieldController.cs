using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/Fields")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class FieldController : ControllerBase
    {
        private directContext direct;
        private IClientService clientService;
        private ILogger _logWriter;
        const int errCode_Same_FieldName = 409;

		public FieldController(directContext direct, IClientService clientService, ILogger<FieldController> logWriter)
        {
            this.direct = direct;
            this.clientService = clientService;
            this._logWriter = logWriter;
        }

        // GET: /<controller>/
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Index()
        {
            try
            {
			   var results = (from item
						      in direct.ClientEntityFields
							  where item.ClientId == clientService.ClientId
							  select new { item.Id, item.UpdateDate, Options = JsonConvert.DeserializeObject(item.Options) } into selection 
							  orderby selection.UpdateDate descending							   
							  select selection).ToList();
			   var sortedResult = from item in results select new { item.Id, item.Options};
			   return Ok(sortedResult);
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
                              in direct.ClientEntityFields
                              where item.ClientId == clientService.ClientId && item.Id == new Guid(id)
                              select new { item.Id, item.ClientId,   Options = JsonConvert.DeserializeObject(item.Options), item.CreateDate, item.UpdateDate}).FirstOrDefault();
                return Ok(results);
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }


		[HttpGet]
		[Route("GetFieldNames/{id}")]
		public IActionResult GetFieldNamesAssociatedToFieldList(string id)
		{
			try
			{
				List<dynamic> listFields = new List<dynamic>();
				var results = (from item
							  in direct.ClientEntityFields
							   where item.ClientId == clientService.ClientId && item.Options.Contains(id)
							   select new {Options = JsonConvert.DeserializeObject(item.Options)}).ToList();
				foreach (var fieldName in results)
				{
					dynamic options= JObject.Parse(JsonConvert.SerializeObject(fieldName.Options));
					listFields.Add(options.title);
				}

					return Ok(listFields);
			}
			catch (Exception e)
			{
                _logWriter.LogError(e.Message);
                return BadRequest();
			}
		}


		[HttpPatch]
		[Route("savepatch")]
		public async Task<IActionResult> PatchAsync([FromBody] dynamic patch)
        {
            try
            {
                string id = patch["id"].ToString();
                Guid Id = new Guid(id);
                ClientEntityFields field = (from item in direct.ClientEntityFields.AsNoTracking() where item.Id == Id select item).FirstOrDefault();
                if (field != null)
                {
                    patch.options = JsonConvert.SerializeObject(patch.options);
					dynamic data = JObject.Parse(patch.options.ToString());
					string newFieldTitleVal = data.title.Value;					
					dynamic oldFieldTitle = (JObject)JToken.Parse(JsonConvert.SerializeObject(field));
					dynamic oldTitleVal = JObject.Parse(oldFieldTitle["Options"].ToString());
					string oldFieldTitleName = oldTitleVal.title.Value;				
					
					if (newFieldTitleVal.ToUpper() != oldFieldTitleName.ToUpper())
					{
						bool existsFieldName = ValidateFieldName(patch, newFieldTitleVal);
						if (existsFieldName)
						{
							return StatusCode(409, "A field with name " + data.title.Value + " already exists");
						}
					}

					JObject oldField = (JObject)JToken.Parse(JsonConvert.SerializeObject(field));
                    oldField["Options"] = JObject.Parse(oldField["Options"].ToString());

                    ClientEntityFields newFieldObject = JsonConvert.DeserializeObject<ClientEntityFields>(JsonConvert.SerializeObject(patch));
                    newFieldObject.CreateDate = System.DateTime.Now;
                    newFieldObject.UpdateDate = System.DateTime.Now;
                    newFieldObject.ClientId = clientService.ClientId;
                    JObject newField = (JObject)JToken.FromObject(newFieldObject);
                    newField["Options"] = JObject.Parse(newField["Options"].ToString());

                    oldField.Merge(newField, new JsonMergeSettings() { MergeArrayHandling = MergeArrayHandling.Union });
                    oldField["Options"] = oldField["Options"].ToString();
                    field = oldField.ToObject<ClientEntityFields>();
                    direct.ClientEntityFields.Attach(field);
                    direct.ClientEntityFields.Update(field);
                    int x = await direct.SaveChangesAsync();

                    return Ok();
                }
                else
                    return NotFound();
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }

        [HttpPost]
		[Route("save")]
        [Authorize]
        public async Task<IActionResult> PostAsync([FromBody] dynamic rawfield)
        {
            try
            {
				rawfield.options = JsonConvert.SerializeObject(rawfield.options);
				dynamic data = JObject.Parse(rawfield.options.ToString());
				var newFieldTitleVal = data.title.Value;

				bool existsFieldName= ValidateFieldName(rawfield, newFieldTitleVal);
				if (existsFieldName)
				{
					return StatusCode(409, "A field with name " + data.title.Value + " already exists");
				}

				ClientEntityFields field = JsonConvert.DeserializeObject<ClientEntityFields>(JsonConvert.SerializeObject(rawfield));
                field.CreateDate = System.DateTime.Now;
                field.UpdateDate = System.DateTime.Now;
                field.ClientId = clientService.ClientId;
                try
                {
                    direct.ClientEntityFields.Add(field);
                    int x = await direct.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    direct.ClientEntityFields.Update(field);
                    int x = await direct.SaveChangesAsync();
                }

                return Ok(field.Id);
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromBody] dynamic rawfield)
        {
            try
            {
                rawfield.options = JsonConvert.SerializeObject(rawfield.options);
                ClientEntityFields field = JsonConvert.DeserializeObject<ClientEntityFields>(JsonConvert.SerializeObject(rawfield));
                field.CreateDate = System.DateTime.Now;
                field.UpdateDate = System.DateTime.Now;
                field.ClientId = clientService.ClientId;
                try
                {
                    direct.ClientEntityFields.Add(field);
                    int x = await direct.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    direct.ClientEntityFields.Update(field);
                    int x = await direct.SaveChangesAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logWriter.LogError(ex.Message);
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
                ClientEntityFields s = new ClientEntityFields() { Id = Id };
                direct.ClientEntityFields.Attach(s);
                direct.ClientEntityFields.Remove(s);
                direct.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }
		public bool ValidateFieldName(dynamic rawfield,string newFieldName)
		{

			string _newFieldName = (newFieldName.ToUpper()).ToString();
			var optionList = direct.ClientEntityFields.Where(x => x.ClientId == clientService.ClientId).Select(x => JsonConvert.DeserializeObject(x.Options)).ToList();

			for (int i = 0; i <= optionList.Count - 1; i++)
			{
				dynamic strOption = JObject.Parse(optionList[i].ToString());
				var existingTitle = strOption.title.Value;
				string _existingTitle = (existingTitle.ToUpper()).ToString();
				if (_newFieldName == _existingTitle)
				{
					return true;
				}
			}

			return false;
			
		}
    }
}