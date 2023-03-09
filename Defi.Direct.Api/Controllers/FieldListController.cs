using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/FieldLists")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
	[ApiController]
    [EnableCors("CorsPolicy")]
	public class FieldListController : ControllerBase
    {
        private directContext direct;
        private IClientService clientService;
        private ILogger _logWriter;
        public FieldListController(directContext direct, IClientService clientService, ILogger<FieldListController> logWriter)
        {
            this.direct = direct;
            this.clientService = clientService;
            this._logWriter = logWriter;
        }

        // GET: /<controller>/
        [HttpGet]
        public IActionResult Index()
        {

		try
		{
			List<dynamic> fieldListtArr = new List<dynamic>();
			var results =(from item in direct.FieldLists where item.ClientId == clientService.ClientId select item).OrderBy(item => item.Name).ToList();
		
			for (int i = 0; i <= results.Count - 1; i++)
			{
				dynamic fieldList = new ExpandoObject();
				fieldList.id = results[i].Id;
				fieldList.clientId = results[i].ClientId;
				fieldList.name = results[i].Name;
				fieldList.isSystem = results[i].IsSystem;
				fieldList.sorted = results[i].Sorted;
				fieldList.createDate = results[i].CreateDate;
				fieldList.updateDate = results[i].UpdateDate;
                fieldList.order = results[i].Order;
                fieldList.orderBy = results[i].OrderBy;
                var listCnt = (from item in direct.FieldListItems where item.FieldListId == results[i].Id select item).Count();
				fieldList.fieldListCount = listCnt;
				fieldListtArr.Add(fieldList);
			}
		 
		 return Ok(fieldListtArr);
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
                var results = from item in direct.FieldLists.Include("FieldListItems") where item.ClientId == clientService.ClientId && item.Id == new Guid(id) select item;
                return Ok(results.FirstOrDefault());
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }

		[HttpPost]
        [Authorize]
        public async Task<IActionResult> PostAsync([FromBody] FieldLists field)
        {

			try
			{
				FieldLists newFieldListObject = JsonConvert.DeserializeObject<FieldLists>(JsonConvert.SerializeObject(field));
				newFieldListObject.ClientId = clientService.ClientId;
				newFieldListObject.CreateDate = DateTime.Now;
				newFieldListObject.UpdateDate = DateTime.Now;
				string newFieldName = newFieldListObject.Name;

				try
				{
					var fieldCount = direct.FieldLists.Where(x => x.Id == newFieldListObject.Id && x.ClientId == newFieldListObject.ClientId).Count();

					if (fieldCount == 0)
					{
						var fieldNameCnt = direct.FieldLists.Where(x => x.Name.ToLower() == newFieldListObject.Name.ToLower() && x.ClientId == newFieldListObject.ClientId).Count();

						if (fieldNameCnt > 0)
						{
							return StatusCode(409, "A FieldList with name " + newFieldListObject.Name + " already exists");
						}
					}

					if (newFieldListObject.Id == Guid.Empty || fieldCount == 0)
					{
                        newFieldListObject.Id = newFieldListObject.Id == Guid.Empty ? Guid.NewGuid() : newFieldListObject.Id;
                        var fieldItems = newFieldListObject.FieldListItems;
						newFieldListObject.FieldListItems = null;
						direct.FieldLists.Add(newFieldListObject);
						if (fieldItems != null)
						{
							foreach (var item in fieldItems)
							{
								direct.FieldListItems.Add(new FieldListItems
								{
									CreateDate = DateTime.Now,
									Display = item.Display,
									FieldListId = newFieldListObject.Id,
									Ordinal = item.Ordinal,
									UpdateDate = DateTime.Now,
									UpdatedBy = Guid.NewGuid(),
									Value = item.Value,
                                    Id = Guid.NewGuid()
								});
							}

						}
						await direct.SaveChangesAsync();
					}
					else
					{
						string existingFieldName = direct.FieldLists.Where(x => x.Id == newFieldListObject.Id && x.ClientId == newFieldListObject.ClientId).Select(x => x.Name).FirstOrDefault();
						if (existingFieldName.ToUpper() != newFieldName.ToUpper())
						{
							var fieldNameCnt = direct.FieldLists.Where(x => x.ClientId == newFieldListObject.ClientId && x.Name.ToUpper().Contains(newFieldListObject.Name.ToUpper())).Count();

							if (fieldNameCnt > 0)
							{
								return StatusCode(409, "A FieldList with name " + newFieldListObject.Name + " already exists");
							}
						}
						var existinglistItemId = (from x in direct.FieldListItems
												  where x.FieldListId == newFieldListObject.Id
												  select x.Id).ToList();
						var fieldItems = newFieldListObject.FieldListItems;
						newFieldListObject.FieldListItems = null;
						direct.FieldLists.Update(newFieldListObject);

						foreach (var item in fieldItems)
						{
							var listItem = direct.FieldListItems.Where(x => x.Id == item.Id && x.FieldListId == newFieldListObject.Id).FirstOrDefault();							
							
							if (listItem != null)
							{						
								listItem.Display = item.Display;
								listItem.Ordinal = item.Ordinal;
								listItem.UpdateDate = DateTime.Now;								
								listItem.Value = item.Value;
								existinglistItemId.Remove(listItem.Id);
								direct.FieldListItems.Update(listItem);
							}
							else
							{								
								direct.FieldListItems.Add(new FieldListItems
								{
									CreateDate = DateTime.Now,
									Display = item.Display,
									FieldListId = newFieldListObject.Id,
									Ordinal = item.Ordinal,
									UpdateDate = DateTime.Now,
									UpdatedBy = Guid.NewGuid(),
									Value = item.Value,
									Id = Guid.NewGuid()
								});
							}
						
						}
						if (existinglistItemId.Count > 0)
						{
							foreach (var t in existinglistItemId)
							{
								Guid Id = Guid.Parse(t.ToString());
								FieldListItems s = new FieldListItems() { Id = Id };
								direct.FieldListItems.Attach(s);
								direct.FieldListItems.Remove(s);
							}
						}
						await direct.SaveChangesAsync();
					}

				}
				catch (DbUpdateException)
				{
					direct.FieldLists.Update(newFieldListObject);
					int x = await direct.SaveChangesAsync();
				}

				return Ok(newFieldListObject.Id);
			}
			catch (Exception e)
			{
                _logWriter.LogError(e.Message);
                return BadRequest();
			}
		}

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromBody] FieldLists field)
        {
            try
            {
                try
                {
                    direct.FieldLists.Add(field);
                    direct.FieldListItems.AttachRange(field.FieldListItems);
                    int x = await direct.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    direct.FieldLists.Update(field);
                    direct.FieldListItems.AttachRange(field.FieldListItems);
                    int x = await direct.SaveChangesAsync();
                }

                return Ok();
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
                FieldLists s = new FieldLists() { Id = Id };
                direct.FieldLists.Attach(s);
                direct.FieldLists.Remove(s);
                direct.SaveChanges();

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