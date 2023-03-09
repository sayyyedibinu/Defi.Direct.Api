using System;
using System.Linq;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/FieldListItems")]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [ApiController]
    [EnableCors("CorsPolicy")]
    public class FieldListItemController : ControllerBase
    {
        private directContext direct;
        private IClientService clientService;
        private ILogger _logWriter;
        public FieldListItemController(directContext direct, IClientService clientService, ILogger<FieldListItemController> logWriter)
        {
            this._logWriter = logWriter;
            this.direct = direct;
            this.clientService = clientService;
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetSpecific(string id)
        {
            try
            {
                var results = from item in direct.FieldListItems where item.FieldListId == new Guid(id) select item;
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
        public async Task<IActionResult> PostAsync([FromBody] FieldListItems field)
        {
            try
            {
                try
                {
                    direct.FieldListItems.Add(field);
                    int x = await direct.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    direct.FieldListItems.Update(field);
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
        public async Task<IActionResult> PutAsync([FromBody] FieldListItems field)
        {
            try
            {
                try
                {
                    direct.FieldListItems.Add(field);
                    int x = await direct.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    direct.FieldListItems.Update(field);
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
                FieldListItems s = new FieldListItems() { Id = Id };
                direct.FieldListItems.Attach(s);
                direct.FieldListItems.Remove(s);
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