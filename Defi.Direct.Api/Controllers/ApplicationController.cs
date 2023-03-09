using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Defi.Direct.Coreservices.Interfaces;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenIddict.Validation.AspNetCore;


namespace Defi.Direct.Api.Controllers
{
	[Route("api/Application")]
	[ApiController]
	[EnableCors("CorsPolicy")]
	public class ApplicationController : ControllerBase
    {
		
		private directContext direct;
		private ILogger _logWriter;
		private readonly IClientService clientService;
		private IEncryptionService encryption;
        private Credentials _credentials;
        private ITransactionLogger transactionLogger;

        public ApplicationController(directContext direct, ILogger<ApplicationController> logWriter, IOptions<Credentials> credentials, IClientService clientService,IEncryptionService encrypt, ITransactionLogger transactionLogger)
		{
			this.direct = direct;
			_logWriter = logWriter;
            _credentials = credentials == null ? null : credentials.Value;
            this.clientService = clientService;
			this.encryption = encrypt;
            this.transactionLogger = transactionLogger;

		}
		[HttpGet]
		[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
		public IActionResult Index()
		{
			try
			{
				var results = (from item in direct.Apps where item.ClientId == clientService.ClientId select new { item.Id, item.ClientId, item.SiteId, item.VersionId, item.CreateDate, item.UpdateDate, item.BorrowerHash, item.AppData }).ToList().OrderBy(item => item.UpdateDate);

				return Ok(results);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[HttpGet]
        [AllowAnonymous]
        [Route("{id}")]
		public IActionResult GetSpecific(string id)
		{
			try
			{
				var results = (from item
							  in direct.Apps
							   where item.ClientId == clientService.ClientId && item.Id == new Guid(id)
							   select new { item.Id, item.ClientId, item.BorrowerHash, siteDetails=JsonConvert.DeserializeObject(encryption.Decrypt(item.AppData)), item.CreateDate, item.UpdateDate, item.VersionId, item.SiteId }).FirstOrDefault();
				return Ok(results);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
	

		[HttpPut]
        [AllowAnonymous]
        [Route("UpdateAppData/{appsId}/{startoverflag?}")]
		public async Task<IActionResult> UpdateAppData([FromBody] JToken jToken,Guid appsId,string startoverflag="update")
		{
			try
			{
				string applicationInfo = jToken.ToString();
				dynamic appData = JObject.Parse(applicationInfo);
				dynamic _existinAppData = null;

				JObject datasetObj = JObject.Parse(applicationInfo);
				string firstName = null;
				string lastName = null;

				if (datasetObj.ContainsKey("FirstName") && !(String.IsNullOrEmpty(datasetObj["FirstName"].ToString())))
				{
					firstName = datasetObj["FirstName"].ToString();
				}
				if (datasetObj.ContainsKey("LastName") && !(String.IsNullOrEmpty(datasetObj["LastName"].ToString())))
				{
					lastName = datasetObj["LastName"].ToString();
				}

				dynamic _ApptableData=null;
				var AppData_Db = (from item in direct.Apps where item.Id == appsId select item).FirstOrDefault();

				if (AppData_Db == null)
					return NotFound();
				else
				{
					
					var result = (from item in direct.SiteVersions where (item.SiteId == AppData_Db.SiteId && item.Active) select new { versionId = item.Id, activesiteJson = item.SiteOptions }).FirstOrDefault();

					if (result != null)
					{
						//dynamic _existinAppData = JObject.Parse(JsonConvert.DeserializeObject(result.activesiteJson).ToString());
						//_existinAppData.site.data = appData;
						//AppData_Db.AppData = encryption.Encrypt(_existinAppData.ToString());//to update the changed setting also if there is  version change
						//AppData_Db.UpdateDate = DateTime.Now;
						////AppData_Db.VersionId = versionId;
						//AppData_Db.VersionId = result.versionId;						
						dynamic _existingActiveData = JObject.Parse(JsonConvert.DeserializeObject(result.activesiteJson).ToString());
						if (startoverflag == "startover" )
						{
							AppData_Db.AppData = encryption.Encrypt(_existingActiveData.ToString());//if startover change the entire Appdata to the active site[in this case "data" in sitejson will be blank]
							
						}						
						else if (startoverflag == "continue")
						{
							_existinAppData = JObject.Parse(JsonConvert.DeserializeObject(result.activesiteJson).ToString());							
							dynamic site_datset = _existinAppData.site.data;
							dynamic app_dataset = appData;
							Dictionary<string, string> app_dict = JsonConvert.DeserializeObject<Dictionary<string, string>>(app_dataset.ToString());
							var site_dict = JsonConvert.DeserializeObject<Dictionary<string, string>>(site_datset.ToString());

							Dictionary<string, string> dictionary_sitedatacopy = new Dictionary<string, string>(site_dict);
							Dictionary<string, string> newdictionary_appsdata = new Dictionary<string, string>();

							foreach (var kvp in dictionary_sitedatacopy)
							{
								string dicval;
								if (app_dict.TryGetValue(kvp.Key, out dicval))
								{
									newdictionary_appsdata.Add(kvp.Key, dicval);
								}
								else
								{
									newdictionary_appsdata.Add(kvp.Key, "");
								}
							}				

					
							_existinAppData.site.data = JObject.Parse(FromDictionaryToJson(newdictionary_appsdata).ToString());
							AppData_Db.AppData = encryption.Encrypt(_existinAppData.ToString());							
						}
						else
						{
							_ApptableData = JObject.Parse(JsonConvert.DeserializeObject(encryption.Decrypt(AppData_Db.AppData)).ToString());
							_ApptableData.site.data = appData;
							AppData_Db.AppData = encryption.Encrypt(_ApptableData.ToString());
						}

						AppData_Db.UpdateDate = DateTime.Now;						
						AppData_Db.VersionId = result.versionId;
						AppData_Db.FirstName = firstName;
						AppData_Db.LastName = lastName;
						direct.Apps.Update(AppData_Db);
                        try
                        {
                            transactionLogger.Create(AppData_Db);
                        }
                        catch (Exception e)
                        {
                            _logWriter.LogError(e.Message);
                        }
                        await direct.SaveChangesAsync();

						if (startoverflag == "startover")
							return Ok(_existingActiveData.site);
						else if (startoverflag == "continue")
							return Ok(_existinAppData.site);
						else
							return Ok();
					}
					else
					{
						return StatusCode(403, "Please publish your site for saving the data");

					}
				}
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
                    
		}
		public string FromDictionaryToJson(Dictionary<string, string> dictionary)
		{
			var newkeyvaldic = dictionary.Select(kvp => string.Format("\"{0}\":\"{1}\"", kvp.Key, string.Join(",", kvp.Value)));
			return string.Concat("{", string.Join(",", newkeyvaldic), "}");
		}

		[HttpPost]
		[AllowAnonymous]
		public async Task<IActionResult> PostAsync([FromBody] JToken jToken)
		{
			try
			{
				string applicationInfo = jToken.ToString();
                _logWriter.LogInformation($"Entered Applicationcontroller.PostAsync with applicationinfo : {applicationInfo} for client {clientService?.ClientId}");
                dynamic appObj = JObject.Parse(applicationInfo);
				string pageId = appObj.pageID;
				dynamic appData = appObj.data;
				string dataset = appData.ToString();
				JObject datasetObj = JObject.Parse(dataset);
				string firstName = null;
				string lastName = null;

				if (datasetObj.ContainsKey("FirstName") && !(String.IsNullOrEmpty(datasetObj["FirstName"].ToString())))
				{
					firstName = datasetObj["FirstName"].ToString();
				}
				if (datasetObj.ContainsKey("LastName") && !(String.IsNullOrEmpty(datasetObj["LastName"].ToString())))
				{
					lastName = datasetObj["LastName"].ToString();
				}

				if (pageId == "") return BadRequest();

				dynamic borrowerDet = appObj.borrowerData;
				borrowerDet.BorrowerClientId = clientService.ClientId;
				var emailId = appObj.borrowerData.BorrowerEmail;


				string dat = JsonConvert.SerializeObject(borrowerDet);		
				var md5 = new MD5CryptoServiceProvider();
				var md5BorrowerData = md5.ComputeHash(Encoding.ASCII.GetBytes(dat.ToLower()));
				var strmd5Data = GetMd5HashFromJson(md5BorrowerData);

				var results = (from item in direct.Sites where item.Id == Guid.Parse(pageId) select new { baseSite = JsonConvert.DeserializeObject(item.Site), clientId = item.ClientId }).FirstOrDefault();

				dynamic newSiteInfo = JObject.Parse(results.baseSite.ToString());
				newSiteInfo.site.data = appData;

				var client = direct.Clients.Where(x => x.Id == clientService.ClientId).Select(x => new { x.HostName, x.Name }).FirstOrDefault(); ;

				var versionDet = (from item in direct.SiteVersions where (item.SiteId == Guid.Parse(pageId) && item.Active) select item).FirstOrDefault();
				Guid applicationId = Guid.NewGuid();
				Apps application = new Apps() { Id = applicationId, SiteId= Guid.Parse(pageId),VersionId=Guid.Parse(versionDet.Id.ToString()),EmailId= emailId.Value, BorrowerHash = strmd5Data, AppData= encryption.Encrypt(newSiteInfo.ToString()), ClientId = clientService.ClientId, CreateDate = DateTime.Now, UpdateDate = DateTime.Now, AppId= applicationId, FirstName = firstName, LastName = lastName, ClientName = client.Name.ToString(),HostName =client.HostName.ToString(),VersionTitle=versionDet.Title };
						
				try
				{
					direct.Apps.Add(application);
					await direct.SaveChangesAsync();
                    _logWriter.LogInformation($"Completed direct.savechangesasync in ApplicationController for client {clientService?.ClientId}");
                    try
                    {
                        _logWriter.LogInformation($"Entered transactionlogger.create in ApplicationController - Params : Application id {application.Id} for client {clientService?.ClientId}");
                        transactionLogger.Create(application);
                        _logWriter.LogInformation($"Completed transactionlogger.create in ApplicationController for client {clientService?.ClientId}");
                    }
                    catch (Exception e)
                    {
                        _logWriter.LogError(e.Message);
                    }
                }
				catch (Exception ex)
				{
                    _logWriter.LogError(ex.Message);
                    return BadRequest();
				}

				return Ok(applicationId);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		public string GetHashdata(dynamic appObj)
		{
			try
			{
				string pageId = appObj.pageID;

				dynamic borrowerDet = appObj.borrowerData;
				borrowerDet.BorrowerClientId = clientService.ClientId;

				dynamic appData = appObj.data;

				string _borrwerdata = JsonConvert.SerializeObject(borrowerDet);
				var md5 = new MD5CryptoServiceProvider();
				var md5BorrowerData = md5.ComputeHash(Encoding.ASCII.GetBytes(_borrwerdata.ToLower()));
				var strmd5Data = GetMd5HashFromJson(md5BorrowerData);
				return strmd5Data;				
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return "Fail";
			}

		}
		[HttpPost]		
		[Route("GetDecision")]
		public IActionResult RedirectUser([FromBody] JToken jToken)
		{
			string applicationInfo = jToken.ToString();
			dynamic appObj = JObject.Parse(applicationInfo);
			string pageId = appObj.pageID;
			string dbresults = GetHashdata(appObj);
			var result = (from item in direct.Apps where (item.Id == Guid.Parse(pageId) && item.BorrowerHash == dbresults) select item).OrderByDescending(item => item.UpdateDate).FirstOrDefault();
			if (result != null)
			{
				if (result.DecisionData != null)
				{
					var newdata = encryption.Decrypt(result.DecisionData);
					XmlDocument document = new XmlDocument();
					document.LoadXml(newdata);
					string json = JsonConvert.SerializeXmlNode(document);
					return Ok(JsonConvert.SerializeObject(new { message = "Decision received", siteId = result.SiteId, appId = result.Id, appData = JsonConvert.DeserializeObject(encryption.Decrypt(result.AppData)), decision = json }));

				}
				else
				{
					//var applicationDet = (from item in direct.Apps where (item.SiteId == Guid.Parse(pageId) && item.Id == dbresults.Id) select new { siteInfo = JsonConvert.DeserializeObject(encryption.Decrypt(item.AppData)), versionId = item.VersionId, updateDt = item.UpdateDate, appsId = item.Id }).OrderByDescending(item => item.updateDt).FirstOrDefault();
					var versionresult = (from item in direct.SiteVersions where (item.SiteId == result.SiteId && item.Active) select new { versionId = item.Id, activesiteJson = item.SiteOptions }).FirstOrDefault();

					if (result.VersionId != versionresult.versionId)
					{
						return Ok(JsonConvert.SerializeObject(new { message = "Version mismatch", siteId = result.SiteId, appId = result.Id, appData = JsonConvert.DeserializeObject(encryption.Decrypt(result.AppData)), actualdata = JsonConvert.DeserializeObject(versionresult.activesiteJson) }));
					}
					else
					{
						return Ok(JsonConvert.SerializeObject(new { message = "Version match", siteId = result.SiteId, appId = result.Id, appData = JsonConvert.DeserializeObject(encryption.Decrypt(result.AppData)) }));
					}


				}
			}

			else
			{
				return StatusCode(403, "This information doesn’t match any application in our system. Please correct your information and try again.");
			}
		}

		[HttpPost]
		[AllowAnonymous]
		[Route("GetApplication")]
		public async Task<IActionResult> GetApplication([FromBody] JToken jToken)
		{
			try
			{
				string applicationInfo = jToken.ToString();
				dynamic appObj = JObject.Parse(applicationInfo);
				string strmd5Data = GetHashdata(appObj);
				string pageId = appObj.pageID;

				//dynamic borrowerDet = appObj.borrowerData;
				//borrowerDet.BorrowerClientId = clientService.ClientId;

				//dynamic appData = appObj.data;

				//string _borrwerdata = JsonConvert.SerializeObject(borrowerDet);
				//var md5 = new MD5CryptoServiceProvider();
				//var md5BorrowerData = md5.ComputeHash(Encoding.ASCII.GetBytes(_borrwerdata.ToLower()));
				//var strmd5Data = GetMd5HashFromJson(md5BorrowerData);

				var dbresults = (from item in direct.Apps where (item.SiteId == Guid.Parse(pageId) && item.BorrowerHash == strmd5Data) select item).OrderByDescending(item => item.UpdateDate).FirstOrDefault();
				if (dbresults != null)
				{
					//var applicationDet = (from item in direct.Apps where (item.SiteId == Guid.Parse(pageId) && item.Id == dbresults.Id)
					//					  select new { siteInfo = JsonConvert.DeserializeObject(encryption.Decrypt(item.AppData)),
					//						  versionId = item.VersionId, updateDt = item.UpdateDate, appsId = item.Id })
					//						  .OrderByDescending(item => item.updateDt).FirstOrDefault();
					var applicationDet = (from item in direct.Apps
							where (item.SiteId == Guid.Parse(pageId) && item.Id == dbresults.Id)
							select new
							{
								siteInfo = JsonConvert.DeserializeObject(encryption.Decrypt(item.AppData)),
								versionId = item.VersionId,
								updateDt = item.UpdateDate,
								appsId = item.Id
							})									  
						.OrderByDescending(item => item.updateDt).FirstOrDefault();

					//dynamic existing_siteinfodataset = applicationDet.siteInfo;


					var versionId = (from item in direct.SiteVersions where (item.SiteId == Guid.Parse(pageId) && item.Active) select item.Id).FirstOrDefault();

					if (applicationDet.versionId != versionId)
					{
						return Ok(JsonConvert.SerializeObject(new { message = "Version mismatch", existingdata = applicationDet }));
					}
					else
					{
						return Ok(JsonConvert.SerializeObject(new { message = "Version match", existingdata = applicationDet }));
					}
				}
				else
				{
					return StatusCode(403, "This information doesn’t match any application in our system. Please correct your information and try again.");
				}

			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[HttpDelete]
		[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
		[Route("{id}")]
		public IActionResult Delete(string id)
		{
			try
			{
				Guid Id = Guid.Parse(id);
				Apps app = new Apps() { Id = Id };
				direct.Apps.Attach(app);
				direct.Apps.Remove(app);
				direct.SaveChanges();
				return Ok();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}

		[HttpPost]
		[Route("DecisionResponse")]
		public async Task<IActionResult> PostUpdateDecisionAsync()
		{
			try
			{
				var apiKey = Request.Headers["X-Api-Key"].ToString();
				if (_credentials.ApiKey == null || apiKey != _credentials.ApiKey)
				{
					_logWriter.LogError($"401 Api Key {_credentials.ApiKey} does not match {apiKey}");
					return Unauthorized();
				}
			}
			catch (Exception e)
			{
				_logWriter.LogError(e, "401 Error retrieving api key from header");
				return Unauthorized();
			}
			var result = "OK";
			try
			{
				string xmldata;
				using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
				{
					xmldata = await reader.ReadToEndAsync();
				}
				XmlDocument document = new XmlDocument();
				document.LoadXml(xmldata);
				string appId = document.SelectSingleNode("custom_ack/AppId").InnerText;
				if (appId != null)
				{
					Apps application = (from item in direct.Apps where item.AppId.ToString() == appId.ToLower() select item).FirstOrDefault();
					if (application != null)
					{
						application.DecisionData = encryption.Encrypt(xmldata);
						//application.DecisionData = xmldata;
						direct.Apps.Update(application);
						await direct.SaveChangesAsync();
						try
						{
							transactionLogger.Create(application);
						}
						catch (Exception e)
						{
							_logWriter.LogError(e.Message);
						}
					}
				}
				return Ok(result);
			}
			catch (Exception e)
			{
				result = "False";
				_logWriter.LogError(e, "400 Error In getting request  " + e.Message);
				return BadRequest(result);
			}
		}

		private string GetMd5HashFromJson(byte[] byteArray)
		{
			using (var md5 = MD5.Create())
			using (var stream = new MemoryStream(byteArray))
				return BitConverter.ToString(md5.ComputeHash(stream)).Replace("-", string.Empty).ToLower();
		}
	}
}