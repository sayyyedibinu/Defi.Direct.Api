using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Defi.Direct.Domain.Models;
using Elements.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Defi.Direct.Services.Interfaces;
using Defi.Direct.Coreservices.Interfaces;
using OpenIddict.Validation.AspNetCore;
using Defi.Direct.Coreservices.Configuration;
using Microsoft.Extensions.Options;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Defi.Direct.Api.Controllers
{
	[Route("api/Sites")]
	[Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
	[EnableCors("CorsPolicy")]
	public class SiteController : Controller
	{
		private directContext direct;
		private ILogger _logWriter;
		private readonly IClientService clientService;
        private ITransactionLogger transactionLogger;
        private ConfigSettingKeys configSettingKey;

		private IEncryptionService encryption;
		public SiteController(directContext direct, ILogger<SiteController> logWriter, IClientService clientService, IEncryptionService encrypt, ITransactionLogger transactionLogger,
            IOptions<ConfigSettingKeys> configSettingKeys)
		{
			this.direct = direct;
			_logWriter = logWriter;
            this.transactionLogger = transactionLogger;
			this.clientService = clientService;
			this.encryption = encrypt;
			this.configSettingKey = configSettingKeys.Value ?? null;
		}

		// GET: /<controller>/
		[HttpGet]
		public IActionResult Index()
		{
			try
			{
				List<SiteList> siteInfo = new List<SiteList>();
				var results = (from item
							  in direct.Sites where item.ClientId == clientService.ClientId
							   select new { Site = JsonConvert.DeserializeObject(item.Site),item.CustomUrl }).ToList();
				for (int i = 0; i <= results.Count - 1; i++)
				{
					try
					{
						SiteList site_list = new SiteList();
						Site siteItem = new Site();
						dynamic siteDetails = JObject.Parse(results[i].Site.ToString());
						site_list.Id = siteDetails.id.Value;
						DateTime updatedDt = siteDetails.dtLastUpdated.Value;
						site_list.UpdatedDt = updatedDt;
						dynamic siteVal = siteDetails.site;
						siteItem.title = siteVal.title.Value;
						site_list.site = siteItem;
						site_list.CustomUrl = results[i].CustomUrl;
						site_list.IsPublished = direct.SiteVersions.Any(x => x.SiteId == Guid.Parse(site_list.Id) && x.Active == true);						
						siteInfo.Add(site_list);
					}
					catch (Exception e) {
						_logWriter.LogWarning(e.Message);
					}
				}
				siteInfo = siteInfo.Where(p => p.UpdatedDt != null).OrderByDescending(p => p.UpdatedDt).ToList();
				var siteList = (from s in siteInfo select new { s.Id, s.site, s.IsPublished,s.CustomUrl }).ToList();
				return Ok(siteList);
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
				bool isPublished = direct.SiteVersions.Any(x => x.SiteId == Guid.Parse(id) && x.Active == true);
				dynamic results = direct.Sites.Where(x => x.Id == Guid.Parse(id)).Select(x => new { Site = JObject.Parse(x.Site), ActionStatus = x.ActionStatus, IsPublished = isPublished, CustomUrl = x.CustomUrl }).FirstOrDefault();
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
        [Route("client")]
        public IActionResult GetClientDetails(string id)
        {
            try
            {
                dynamic results = (from item in direct.Clients where item.Id == clientService.ClientId select item).FirstOrDefault();
                return Ok(results);
            }
            catch (Exception e)
            {
                _logWriter.LogError(e.Message);
                return BadRequest();
            }
        }

        [HttpPost]
		[Route("CopySite/{siteId}/{newSiteTitle}")]
		[Authorize]
		public async Task<IActionResult> CopySite(Guid siteId, string newSiteTitle)
		{
			try
			{

				var results = (from item in direct.Sites where item.Id == Guid.Parse(siteId.ToString()) select new { baseSite = JsonConvert.DeserializeObject(item.Site), clientId = item.ClientId }).FirstOrDefault();

				dynamic newSiteInfo = JObject.Parse(results.baseSite.ToString());

				bool existsSiteName = ValidateSiteName(newSiteInfo, newSiteTitle);
				if (existsSiteName)
				{
					return StatusCode(409, "A site with name " + newSiteTitle + " already exists");
				}

				newSiteInfo.dtLastUpdated = DateTime.Now;
				newSiteInfo.site.title = newSiteTitle;
				Guid newSiteId = Guid.NewGuid();
				newSiteInfo.id = newSiteId;

				Sites s = new Sites() { Id = newSiteId, Site = newSiteInfo.ToString(), ClientId = results.clientId };
				direct.Sites.Add(s);
				int x = await direct.SaveChangesAsync();
				return Ok(newSiteId);
			}
			catch (Exception ex)
			{
				_logWriter.LogError(ex.Message);
				return (BadRequest());
			}

		}


		[HttpPost]
		[Authorize]
		public async Task<IActionResult> PostAsync([FromBody] JToken jToken)
		{
			try
			{
				string site = jToken.ToString();
				dynamic siteObj = JObject.Parse(site);
				string id = siteObj.id;
				dynamic siteDetails = siteObj.site;
				string newSiteTitleVal = siteDetails.title.Value;
				string actionStatus = null;
				dynamic custUrl = null;

				dynamic siteInfo = (from item in direct.Sites where item.Id == Guid.Parse(id) select JObject.Parse(item.Site)).FirstOrDefault();

				if (siteInfo == null)
				{
					bool existsSiteName = ValidateSiteName(siteDetails, newSiteTitleVal);
					if (existsSiteName)
					{
						return StatusCode(409, "A site with name " + siteDetails.title.Value + " already exists");
					}
				}
				else
				{
					dynamic existingSiteName = siteInfo.site;
					string existingSiteTitle = existingSiteName.title.Value;
					actionStatus = "Saved";
					custUrl = (from item in direct.Sites where item.Id == Guid.Parse(id) select item.CustomUrl).FirstOrDefault();

					if (newSiteTitleVal.ToUpper() != existingSiteTitle.ToUpper())
					{
						bool existsFieldName = ValidateSiteName(siteDetails, newSiteTitleVal);
						if (existsFieldName)
						{
							return StatusCode(409, "A site with name " + siteDetails.title.Value + " already exists");
						}
					}

				}
				siteObj.dtLastUpdated = DateTime.Now;
				if (siteObj.id == null)
				{
					siteObj.id = Guid.NewGuid();
				}
				Sites s = new Sites() { Id = siteObj.id, ClientId = clientService.ClientId, Site = siteObj.ToString(), ActionStatus = actionStatus, CustomUrl = (custUrl == null ? siteObj.id : custUrl) };

				try
				{
					direct.Sites.Add(s);
					int x = await direct.SaveChangesAsync();
				}
				catch (DbUpdateException)
				{
					direct.Sites.Update(s);
					int x = await direct.SaveChangesAsync();
				}

				return Ok(s.Id);
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
				string site = jToken.ToString();
				dynamic siteObj = JObject.Parse(site);
				string id = siteObj.id;
				dynamic siteDetails = siteObj.site;
				string newSiteTitleVal = siteDetails.title.Value;

				dynamic siteInfo = (from item in direct.Sites where item.Id == Guid.Parse(id) select JObject.Parse(item.Site)).FirstOrDefault();

				if (siteInfo == null)
				{
					bool existsSiteName = ValidateSiteName(siteDetails, newSiteTitleVal);
					if (existsSiteName)
					{
						return StatusCode(409, "A site with name " + siteDetails.title.Value + " already exists");
					}
				}
				else
				{
					dynamic existingSiteName = siteInfo.site;
					string existingSiteTitle = existingSiteName.title.Value;

					if (newSiteTitleVal.ToUpper() != existingSiteTitle.ToUpper())
					{
						bool existsFieldName = ValidateSiteName(siteDetails, newSiteTitleVal);
						if (existsFieldName)
						{
							return StatusCode(409, "A site with name " + siteDetails.title.Value + " already exists");
						}
					}

				}
				siteObj.dtLastUpdated = DateTime.Now;
				Sites s = new Sites() { Id = siteObj.id, ClientId = clientService.ClientId, Site = site };
				try
				{
					direct.Sites.Add(s);
					int x = await direct.SaveChangesAsync();
				}
				catch (DbUpdateException)
				{
					direct.Sites.Update(s);
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
				Sites s = new Sites() { Id = Id };
				direct.Sites.Attach(s);
				direct.Sites.Remove(s);
				direct.SaveChanges();

				return Ok();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}

		[HttpGet]
		[AllowAnonymous]
		[Route("guid")]
		public IActionResult guid()
		{
			return Ok(Guid.NewGuid());
		}

		[HttpGet]
		[AllowAnonymous]
		[Route("OutputFields/{id}")]
		public IActionResult GetOutputFields(string id)
		{
			List<dynamic> outputFieldList = new List<dynamic>();
			var results = (from item in direct.Sites where item.Id == Guid.Parse(id) select JObject.Parse(item.Site)).FirstOrDefault();
			var siteInfo = results.ToString();
			dynamic outputFields = JsonConvert.DeserializeObject(siteInfo);
			foreach (var fieldData in outputFields.site.fieldData)
			{
				foreach (var item in fieldData.fields)
				{
					if (item["readonly"] == true)
					{ outputFieldList.Add(item.title); }
				}

			}

			return Ok(outputFieldList);
		}
		[HttpGet]
		[Route("CreateXsd/{id}")]
		public IActionResult GenerateXsd(string id)
		{
            StringBuilder strXml;
			MemoryStream mStream = new MemoryStream();
			XmlTextWriter writer = new XmlTextWriter(mStream, Encoding.Unicode);
			XmlDocument document = new XmlDocument();
			try
			{
				var results = (from item in direct.Sites where item.Id == Guid.Parse(id) select JObject.Parse(item.Site)).FirstOrDefault();
				var inputFieldList = results.ToString();
				dynamic inputData = JsonConvert.DeserializeObject(inputFieldList);
                List<string> xsdList = new List<string>();
                var strHeader = @"<?xml version=""1.0""?><xs:schema attributeFormDefault=""unqualified"" elementFormDefault=""qualified"" xmlns:xs=""http://www.w3.org/2001/XMLSchema""><xs:element name =""loan-application""><xs:complexType><xs:sequence><xs:element name =""Data""><xs:complexType><xs:sequence>";
				var strFooter = @"</xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element></xs:schema>";
				strXml = new StringBuilder(strHeader);
                strXml.Append("<xs:element name=\"" + "SourceSystemCode" + "\"/>");
				strXml.Append("<xs:element name=\"" + "DealerId" + "\"/>");
                strXml.Append("<xs:element name=\"" + "ApplicationNumber" + "\"/>");
                strXml.Append("<xs:element name=\"" + "AppId" + "\"/>");
                strXml.Append("<xs:element name=\"" + "SubmitFromPage" + "\"/>");

                foreach (var fieldData in inputData.site.fieldData)
				{
					if (fieldData.fields.GetType() != typeof(JArray))
					{
						foreach (var item in fieldData.fields)
						{
							if (item.inputType.Value == "Text Input" || item.inputType.Value == "Dropdown" || item.inputType.Value == "Checkbox" || item.inputType.Value == "Listbox")
							{
								var elementId = item.id;
								var elementVal = elementId.Value;
                                xsdList.Add("<xs:element name=\"" + elementVal + "\"/>");
							}
						}
					}
					else
					{

						foreach (var item in fieldData.fields)
						{
							if (item.GetType() == typeof(JArray))
							{
								foreach (var subitem in item)
								{
									if (subitem.inputType.Value == "Text Input" || subitem.inputType.Value == "Dropdown" || subitem.inputType.Value == "Checkbox" || subitem.inputType.Value == "Listbox")
									{
										var elementId = subitem.id;
										var elementVal = elementId.Value;
                                        xsdList.Add("<xs:element name=\"" + elementVal + "\"/>");
									}
								}
							}
							else
							{
								if (item.inputType.Value == "Text Input" || item.inputType.Value == "Dropdown" || item.inputType.Value == "Checkbox" || item.inputType.Value == "Listbox")
								{
									var elementId = item.id;
									var elementVal = elementId.Value;
                                    xsdList.Add("<xs:element name=\"" + elementVal + "\"/>");
                                }
							}
						}
					}
				}
                foreach (var fieldData in inputData.site.pendingPageFieldData)
                {
                    if (fieldData.inputType.Value == "Slider" || fieldData.inputType.Value == "Checkbox")
                    {
                        var elementId = fieldData.id;
                        var elementVal = elementId.Value;
                        xsdList.Add("<xs:element name=\"" + elementVal + "\"/>");
                    }
                }
                foreach (var fieldData in inputData.site.decisionPageFieldData)
                {
                    if (fieldData.inputType.Value == "Slider" || fieldData.inputType.Value == "Checkbox")
                    {
                        var elementId = fieldData.id;
                        var elementVal = elementId.Value;
                        xsdList.Add("<xs:element name=\"" + elementVal + "\"/>");
                    }
                }

                List<string> controlList = new List<string>();
                foreach(string item in xsdList)
                {
                    if(!controlList.Contains(item))
                    {
                        controlList.Add(item);
                        strXml.Append(item);
                    }
                }
                strXml.Append(strFooter);
				document.LoadXml(strXml.ToString());
				writer.Formatting = System.Xml.Formatting.Indented;
				document.WriteContentTo(writer);
				writer.Flush();
				mStream.Flush();
				mStream.Position = 0;
				StreamReader sReader = new StreamReader(mStream);
				string formattedXml = sReader.ReadToEnd();

				return Ok(formattedXml);
			}
			catch (Exception e)
			{
				var exceptionMsg = e.Message;
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		public bool ValidateSiteName(dynamic rawfield, string newFieldName)
		{

			string _newFieldName = (newFieldName.ToUpper()).ToString();
			var optionList = direct.Sites.Where(x => x.ClientId == clientService.ClientId).Select(x => JsonConvert.DeserializeObject(x.Site)).ToList();

			for (int i = 0; i <= optionList.Count - 1; i++)
			{
				dynamic strOption = JObject.Parse(optionList[i].ToString());
				dynamic sitedetail = strOption.site;
				var existingTitle = sitedetail.title.Value;
				string _existingTitle = (existingTitle.ToUpper()).ToString();
				if (_newFieldName == _existingTitle)
				{
					return true;
				}
			}
			return false;
		}
		
		public async Task<IActionResult> Submit_Application(string pageId, string versionId, dynamic data,string dealerIdOverride,bool submitflag)
		{
			Guid appId= Guid.Empty;
			bool active=false;
			bool frompreview;
			bool published;
			string submitUrl;
			Guid pageIdGuid = Guid.Empty;
			Guid versionIdGuid = Guid.Empty;
			Guid.TryParse(pageId, out pageIdGuid);
			Guid.TryParse(versionId, out versionIdGuid);
			string versionTitle=null;
			string referer = Request.Headers["Referer"].ToString();
			try
			{
				if (versionId != null)
				{
					SiteVersions version = (from item in direct.SiteVersions where item.Id == Guid.Parse(versionIdGuid.ToString()) select item).FirstOrDefault();
					active = version.Active;
					frompreview = true;
					published = true;
					versionTitle = version.Title;
				}
				else
				{
					SiteVersions version = (from item in direct.SiteVersions where (item.SiteId == Guid.Parse(pageIdGuid.ToString()) && item.Active==true) select item).FirstOrDefault();
										
					if (referer.Contains("WorkingCopy"))
					{
						frompreview = true;
						published = false;
						active = false;
						versionIdGuid = Guid.Empty;
					}
					else
					{
						frompreview = false;
						published = true;						
						if (version != null)
						{
							active = version.Active;
							Guid.TryParse(version.Id.ToString(), out versionIdGuid);
							versionTitle = version.Title;
						}
					}

				}

			
				var entity = new Dictionary<string, object>();
				string loan = data.ToString();
				JObject loanObj = JObject.Parse(loan);

				if (loanObj.ContainsKey("AppId") && !(String.IsNullOrEmpty(loanObj["AppId"].ToString())))
                {
                    _logWriter.LogInformation($"Existing application with appid :{loanObj["AppId"]}");
                    appId = (Guid)(loanObj["AppId"]);
				}
				else
                {
                    _logWriter.LogInformation("New application with no app id");
                    appId = Guid.NewGuid();
					entity["AppId"] = appId;
				}
				foreach (var item in loanObj)
				{
					entity[item.Key] = ((JValue)item.Value).Value;
				}
                if (!string.IsNullOrWhiteSpace(dealerIdOverride))
                {
                    entity["DealerId"] = dealerIdOverride;
                }

                var logDealerIdArp64384 = this.configSettingKey?.LogDealerIdArp64384 != null && this.configSettingKey.LogDealerIdArp64384;
                if (logDealerIdArp64384)
                {
                    try
                    {
                        var jsonData = JsonConvert.SerializeObject(entity["DealerId"]);
                        string message = "Submit_Application - App Data : " + jsonData;
                        _logWriter.LogInformation(jsonData);
                    }
                    catch (Exception e)
                    {
						_logWriter.LogError(e.Message);
                    }
                }

                if (pageIdGuid != Guid.Empty)
				{
                    _logWriter.LogInformation("Entering if condition with pageIdGuid not empty");

                    var siteResult = (from item in direct.Sites where item.Id == pageIdGuid select item).First();

					if (siteResult == null)
						throw new NullReferenceException("Site not found for id: " + pageIdGuid);

					if (string.IsNullOrEmpty(siteResult.Site))
						return Ok();

					dynamic siteInfo = JsonConvert.DeserializeObject(siteResult.Site);
					dynamic siteDetails = siteInfo.site;

					dynamic siteSettings = siteDetails.settings;

					if (submitflag)
					{
						submitUrl = (string)siteSettings.submitUrl;
                        entity["SubmitFromPage"] = "Application";
                    }
					else
					{
						submitUrl = (string)siteSettings.updateUrl;
						var appNum = direct.Apps.Where(x => x.Id == appId).Select(x => x.ApplicationNumber).FirstOrDefault();						
						entity.Add("ApplicationNumber", appNum);
                        entity["SubmitFromPage"] = "UpdateApplication";
                        submitUrl = submitUrl.Replace("{AppNumber}", appNum);
					}

					if (siteSettings != null && siteSettings.ContainsKey("submitUrl"))
					{
                        if (!string.IsNullOrWhiteSpace(dealerIdOverride))
                        {
                            siteSettings["DealerId"] = dealerIdOverride;
                        }
						var xml = BuildXml(siteSettings, entity);
						var httpClient = new BasicHttpClient(submitUrl.Trim());
                        try
                        {
                            _logWriter.LogInformation($"API call to submit application with xml data :{xml} for client {clientService?.ClientId}");
                            var results = await httpClient.PostXml(xml);
                            _logWriter.LogInformation("Completed API call to submit application");
                            //var results = @"<?xml version=""1.0"" encoding=""UTF-8""?><custom_ack xmlns:xsi =""http://www.w3.org/2001/XMLSchema-instance""><result>True</result><Decision>A</Decision><ApplicationNumber>2079</ApplicationNumber><AmountFinanced>10000</AmountFinanced><ApplicantFirstName>JAMES</ApplicantFirstName><ApplicantLastName>TESTER</ApplicantLastName><child1><child2><test>bhjgftufygluhiljk</test></child2></child1><AppId>3E339EE9-61A6-465D-A570-3E7B07B59799</AppId><FinalDecision>NOT FINAL</FinalDecision></custom_ack> ";
                            XmlDocument document = new XmlDocument();
                            document.LoadXml(results);

						string appnum = null;

                            string result = null;
                            try
                            {

                                result = document.SelectSingleNode("custom_ack/result").InnerText;
                                if (result.ToLower() == "true")
                                {
                                    result = "Success";
                                    appnum = document.SelectSingleNode("custom_ack/ApplicationNumber").InnerText;
                                }
                                else
                                {
                                    result = "Failure";
                                }
                                _logWriter.LogInformation("Application Number : " + appnum + " Status : " + result);
                            }
                            catch (Exception e)
                            {
                                _logWriter.LogError(e, e.Message);
                                result = result ?? "Failure";
                                appnum = appnum ?? "";
                                _logWriter.LogInformation("Application Number : " + appnum + " Status : " + result);
                            }

                            var client = direct.Clients.Where(x=>x.Id == clientService.ClientId).Select(x => new { x.HostName, x.Name }).FirstOrDefault();
                            try
                            {
                                _logWriter.LogInformation($"Started application fetch from direct.Apps table for client {clientService?.ClientId}");
                                Apps application = (from item in direct.Apps.AsNoTracking() where item.Id == Guid.Parse(appId.ToString()) select item).FirstOrDefault();
                                _logWriter.LogInformation($"Completed application fetch from direct.Apps table:- Params: Application Null: {application == null}, Application number : {(application != null && !string.IsNullOrWhiteSpace(application.ApplicationNumber)? application.ApplicationNumber : "0")}");

                                if (application != null)
                                {
                                    application.DecisionData = encryption.Encrypt(results);
                                    if (application.ClientName == null)
                                        application.ClientName = client.Name.ToString();
                                    if (application.HostName ==null)
                                        application.HostName = client.HostName.ToString();
                                    if (application.VersionTitle == null)
                                        application.VersionTitle = versionTitle;

                                    if (submitflag)
                                    {
                                        application.AppSubmitDate = DateTime.Now;
                                        application.ApplicationNumber = appnum;

                                    }
                                    else
                                    {
                                        application.UpdateDate = DateTime.Now;
                                    }
                                    try
                                    {
                                        direct.Apps.Update(application);
                                        await direct.SaveChangesAsync();
                                    }
                                    catch (Exception ex)
                                    {
                                        _logWriter.LogError(ex, ex.Message + "for Client ID : " + clientService.ClientId);
                                    }
                                }



                                XmlNode newRoot = document.CreateElement("Results");

                                if (document.DocumentElement != null)
                                {
                                    foreach (XmlNode childNode in document.DocumentElement.ChildNodes)
                                    {
                                        newRoot.AppendChild(childNode.CloneNode(true));
                                    }
                                    XmlNode node1 = document.CreateNode(XmlNodeType.Element, "FirstName", "JON");
                                    XmlNode node2 = document.CreateNode(XmlNodeType.Element, "LastName", "Mat");
                                    newRoot.AppendChild(node1);
                                    newRoot.AppendChild(node2);

                                    try
                                    {
                                        await LogReportData(new DataLog { Id = Guid.NewGuid(), ClientId = clientService.ClientId, ClientPageUrl = referer, AppId = appId, TimeStamp = DateTime.Now, RequestStatus = result, ErrorSummary = "", VersionId = versionIdGuid, FromPreview = frompreview, Active = active, Published = published, AppSubmitURL = submitUrl, ApplicationNumber = appnum,VersionTitle=versionTitle,ClientName= client.Name.ToString(),HostName= client.HostName.ToString() });
                                        if (application != null)
                                        {
                                            await LogAppData(application);
                                        }
                                    }
                                    catch (Exception e)
                                    {
                                        _logWriter.LogError(e, e.Message + "for Client ID : " + clientService.ClientId);
                                    }
                                    return Ok(newRoot);
                                }
                            }
                            catch (Exception e)
                            {
                                _logWriter.LogError(e, e.Message + "for Client ID : " + clientService.ClientId);
                            }
                        }
                        catch (Exception e)
                        {
                            _logWriter.LogError(e, e.Message + "for Client ID : " + clientService.ClientId);
                        }

                    }
				}
				else
				{
                    _logWriter.LogInformation($"Entering else condition with pageIdGuid empty for client {clientService?.ClientId}");
                    submitUrl = "https://defidirect.qa.defisolutions.com/Integrator/SubmitApplication?authtoken=0b4329ae9efe4d0ca8a553b67fd7065a";
					active = false;
					frompreview = false;
					published = false;
					var xml = GenerateXml_local(appId);
                    try
                    {
                        var httpClient = new BasicHttpClient(submitUrl);
                        _logWriter.LogInformation($"API call to submit application with xml data : {xml} for client {clientService?.ClientId}");
                        var results = await httpClient.PostXml(xml);
                        _logWriter.LogInformation("Completed API call to submit application for client {clientService?.ClientId}");
                        XmlDocument document = new XmlDocument();
                        document.LoadXml(results);
                        XmlNode newRoot = document.CreateElement("Results");

                        if (document.DocumentElement != null)
                        {
                            foreach (XmlNode childNode in document.DocumentElement.ChildNodes)
                            {
                                newRoot.AppendChild(childNode.CloneNode(true));
                            }
                            await Task.Run(() => LogReportData(new DataLog { Id = Guid.NewGuid(), ClientId = clientService.ClientId, ClientPageUrl = referer, AppId = appId, TimeStamp = DateTime.Now, RequestStatus = "Success", ErrorSummary = "", VersionId = versionIdGuid, FromPreview = frompreview, Active = active, Published = published, AppSubmitURL = submitUrl }));
                            await Task.Run(() => LogAppData(appId));
                            return Ok(newRoot);
                        }
                    }
                    catch (Exception e)
                    {
                        _logWriter.LogError(e, e.Message + "for Client ID : " + clientService.ClientId);
                    }
                }
				await Task.Run(() => LogReportData(new DataLog { Id = Guid.NewGuid(), ClientId = clientService.ClientId, ClientPageUrl = referer, AppId = appId, TimeStamp = DateTime.Now, RequestStatus = "Error", ErrorSummary = "Document element is null", VersionId = versionIdGuid, FromPreview = frompreview, Active = active, Published = published, AppSubmitURL = submitUrl }));
				return Ok("ERROR");
			}

			catch (Exception e)
			{
				await Task.Run(() => LogReportData(new DataLog { Id = Guid.NewGuid(), ClientId = clientService.ClientId, ClientPageUrl = referer, AppId = appId, TimeStamp = DateTime.Now, RequestStatus = "Error", ErrorSummary = e.Message, VersionId = versionIdGuid }));
                _logWriter.LogError(e, e.Message + "for Client ID : " + clientService.ClientId);
                return BadRequest();
			}
		}


		[HttpPost]
		[Route("sendToLos/{pageId}/{createNewApp:bool?}")]
		[AllowAnonymous]
		public async Task<IActionResult> Save(string pageId, [FromBody] dynamic data, string dealerIdOverride = null,bool createNewApp = true)
		{
			try
			{
                var logDealerIdArp64384 = this.configSettingKey?.LogDealerIdArp64384 != null && this.configSettingKey.LogDealerIdArp64384;
                if (logDealerIdArp64384)
                {
                    try
                    {
                        var jsonData = JsonConvert.SerializeObject(data);
                        string message = "Save - App Data : " + jsonData;
                        _logWriter.LogInformation(message);
                    }
                    catch (Exception e)
                    {
						_logWriter.LogError(e.Message);
                    }
                }
                var response = await  Submit_Application(pageId, null, data, dealerIdOverride, createNewApp);
				
				return response;		
			}

			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		
		public string GenerateXml_local(Guid appId)
		{
			
			var entity = new Dictionary<string, object>();
			if (!entity.ContainsKey("SourceSystemCode"))
				entity.Add("SourceSystemCode", "DIRECTQA5");
			else
			{
				entity["SourceSystemCode"] = "DIRECTQA5";
			}
			if (!entity.ContainsKey("DealerId"))
				entity.Add("DealerId", "9898");
			else
			{
				entity["DealerId"] = "9898";
			}
			entity.Add("AppId", appId);

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
			return xml;
		}
		[HttpPost]
		[Route("submitFromVersion/{pageId}/{versionId}")]
		[AllowAnonymous]
		public async Task<IActionResult> submitFromVersion(string pageId, string versionId, [FromBody] dynamic data, string dealerIdOverride = null)
		{
			try
			{
				var logDealerIdArp64384 = this.configSettingKey?.LogDealerIdArp64384 != null && this.configSettingKey.LogDealerIdArp64384;
                if (logDealerIdArp64384)
                {
                    try
                    {
                        var jsonData = JsonConvert.SerializeObject(data);
                        string message = "submitFromVersion - App Data : " + jsonData;
                        _logWriter.LogInformation(message);
                    }
                    catch (Exception e)
                    {
						_logWriter.LogError(e.Message);
                    }
                }
				var response = await Submit_Application(pageId, versionId, data, dealerIdOverride,false);
				return response;
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}

		}
		[HttpPost]
		[Route("sendToPreview/{pageId}")]
		[Produces("application/xml")]
		[AllowAnonymous]
		public async Task<IActionResult> Preview(Guid pageId, [FromBody] dynamic data, string dealerIdOverride = null)
		{
			try
			{

				var entity = new Dictionary<string, object>();
				string loan = data.ToString();
				JObject loanObj = JObject.Parse(loan);

				foreach (var item in loanObj)
				{
					entity[item.Key] = ((JValue)item.Value).Value;
				}
                if (!string.IsNullOrWhiteSpace(dealerIdOverride))
                {
                    entity["DealerId"] = dealerIdOverride;
                }

                var siteResult = (from item in direct.Sites where item.Id == pageId select item).First();

				if (siteResult == null)
					throw new NullReferenceException("Site not found for id: " + pageId);

				if (string.IsNullOrEmpty(siteResult.Site))
					return Ok();

				dynamic siteInfo = JsonConvert.DeserializeObject(siteResult.Site);
				dynamic siteDetails = siteInfo.site;

				dynamic siteSettings = siteDetails.settings;

				string submitUrl = (string)siteSettings.submitUrl;
				string updateUrl = (string)siteSettings.updateUrl;

				if (siteSettings != null && siteSettings.ContainsKey("submitUrl"))
				{
                    if (!string.IsNullOrWhiteSpace(dealerIdOverride))
                    {
                        siteSettings["DealerId"] = dealerIdOverride;
                    }
                    var xml = BuildXml(siteSettings, entity);
					XmlDocument doc = new XmlDocument();
					doc.LoadXml(xml);
					return Ok(doc);
				}
				return BadRequest($"Site settings not vald for {pageId.ToString()}");
			}

			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}

		[HttpPut]
		[Route("updatedSiteInfo/{id}")]
		public IActionResult GetUpdatedSiteInfo(string id)
		{
			
			try
			{				
				var site = direct.Sites.Where(x => x.Id == Guid.Parse(id)).FirstOrDefault();
				var inputFieldList = JObject.Parse(site.Site).ToString();
				dynamic inputData = JsonConvert.DeserializeObject(inputFieldList);
				dynamic outputData = JsonConvert.DeserializeObject(inputFieldList);


                dynamic settings = JsonConvert.DeserializeObject(inputData.site.settings.ToString());
                if(settings["decisionPageDisplayLogic"] != null && settings["decisionPageDisplayLogic"] != "null")
                {
                    string decisionPageDisplayLogicRuleId = Convert.ToString(settings.decisionPageDisplayLogic.Value);
                    dynamic decisionPageDisplayLogicRule = direct.Rules.Where(x => x.Id == Guid.Parse(decisionPageDisplayLogicRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                    settings["decisionPageDisplayLogicDesc"] = decisionPageDisplayLogicRule.desc;
                    outputData.site.settings = settings;
                }

                foreach (var step in inputData.site.steps)
                {
                    dynamic stepData = JsonConvert.DeserializeObject(step.ToString());
                    string displayLogicRuleId = "";
                    if (stepData["displayLogicRule"] != null && stepData["displayLogicRule"] != "null")
                    {
                        displayLogicRuleId = Convert.ToString(stepData.displayLogicRule.Value);
                        stepData["displayLogicRule"] = displayLogicRuleId;
                        dynamic displayLogicRule = direct.Rules.Where(x => x.Id == Guid.Parse(displayLogicRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                        stepData["displayLogicRuleDesc"] = displayLogicRule.desc;
                        outputData.site.steps[inputData.site.steps.IndexOf(step)] = stepData;
                    }
                }

                var fieldlist = (from item
                                    in direct.ClientEntityFields
                                 where item.ClientId == clientService.ClientId
                                 select new { item.Id, item.Options }).ToList();
                var fields = new List<dynamic>();
                var tablefields = new Dictionary<string, dynamic>();
                foreach (var field in fieldlist)
                {
                    dynamic option = JsonConvert.DeserializeObject(JObject.Parse(field.Options).ToString());
                    if (option["id"] != null)
                    {
                        var curfield = new
                        {
                            id = field.Id.ToString(),
                            label = option.id.Value,
							title= option.title.Value,
							xpath = option["xPath"] != null ? option.xPath.Value : "",
                            inputType = option["inputType"] != null ? option.inputType.Value : "",
                            dataType = option["dataType"] != null ? option.dataType.Value : "",
                            displayFormat = option["displayFormat"] != null ? option.displayFormat.Value : ""
                        };
                        fields.Add(curfield);
                        tablefields[field.Id.ToString()] = curfield;
                    }
                }
				
				foreach (var decisionFieldData in inputData.site.decisionPageFieldData)
                {
					
					   dynamic decisionField = JsonConvert.DeserializeObject(decisionFieldData.ToString());
                    string decisionDisplayLogicRuleId = "";
                    if (decisionField.inputType.Value == "Text Area")
                    {
						if (decisionField.decisionTextId != null)
						{
							string updatedDecisionText = decisionField.decisionTextId.Value;
							var updatedDecisionTextFields = new List<dynamic>();
							foreach (var field in fields)
							{
								if (updatedDecisionText.Contains(field.id))
								{
									updatedDecisionTextFields.Add(field);
								}
								updatedDecisionText = updatedDecisionText.Replace("{{" + field.id + "}}", "{{" + field.label + "}}");
							}
							decisionField.decisionText = updatedDecisionText;
							decisionField.decisionTextFields = JsonConvert.SerializeObject(updatedDecisionTextFields);
							outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)] = decisionField;
						}
						
                    }
                    else if (decisionField.inputType.Value == "Table")
                    {
						if (decisionField.cellValues != null && decisionField.cellFields != null)
						{
							dynamic cellValues = JsonConvert.DeserializeObject(decisionField.cellValues.ToString());
							dynamic cellFields = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(decisionField.cellFields.ToString());
							var updatedCellFields = new Dictionary<string, dynamic>();
							foreach (KeyValuePair<string, dynamic> cellField in cellFields)
							{
								var newField = tablefields[cellField.Value.id.ToString()];
								cellValues[cellField.Key] = newField.label;
								updatedCellFields[cellField.Key] = newField;
							}
							decisionField.cellValues = cellValues;
							decisionField.cellFields = JsonConvert.SerializeObject(updatedCellFields);
							outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)] = decisionField;
						}
                    }
					else if (decisionField.inputType.Value == "Slider")
					{
						dynamic maxValuefld = (decisionField.maxValuefielddetails !=null)?JsonConvert.DeserializeObject(decisionField.maxValuefielddetails.ToString()):null;
						dynamic minValuefld = (decisionField.minValuefielddetails !=null)?JsonConvert.DeserializeObject(decisionField.minValuefielddetails.ToString()):null;
						dynamic stepValuefld = (decisionField.stepValuefielddetails != null) ? JsonConvert.DeserializeObject(decisionField.stepValuefielddetails.ToString()):null;
						dynamic currentValuefld = (decisionField.currentValuefielddetails != null) ? JsonConvert.DeserializeObject(decisionField.currentValuefielddetails.ToString()):null;
						//string updateval = maxValuefld.ToString();
						foreach (var field in fields)
						{
							if (maxValuefld!=null && maxValuefld.id==field.id)
							{
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].maxValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].maxValuefrom = field.title;
							}
							if (minValuefld!=null && minValuefld.id == field.id)
							{
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].minValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].minValuefrom = field.title;

							}
							if (stepValuefld!=null && stepValuefld.id == field.id)
							{
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].stepValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].stepValuefrom = field.title;

							}
							if (currentValuefld!=null && currentValuefld.id == field.id)
							{
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].currentValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)].currentValuefrom = field.title;

							}
						}
						
					}

					if (decisionField["displayLogicRule"] != null && decisionField["displayLogicRule"] != "null")
                    {
						decisionDisplayLogicRuleId = Convert.ToString(decisionField.displayLogicRule.Value);
                        decisionField["displayLogicRule"] = decisionDisplayLogicRuleId;
                        dynamic decisionDisplayLogicRule = direct.Rules.Where(x => x.Id == Guid.Parse(decisionDisplayLogicRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                        decisionField["displayLogicRuleDesc"] = decisionDisplayLogicRule.desc;
                        outputData.site.decisionPageFieldData[inputData.site.decisionPageFieldData.IndexOf(decisionFieldData)] = decisionField;
                    }
                }

                foreach (var pendingFieldData in inputData.site.pendingPageFieldData)
                {
					
					dynamic pendingField = JsonConvert.DeserializeObject(pendingFieldData.ToString());
                    string pendingDisplayLogicRuleId = "";
                    if (pendingField.inputType.Value == "Text Area")
                    {
						if (pendingField.decisionTextId != null)
						{
							string updatedPendingText = pendingField.decisionTextId.Value;
							var updatedPendingTextFields = new List<dynamic>();
							foreach (var field in fields)
							{
								if (updatedPendingText.Contains(field.id))
								{
									updatedPendingTextFields.Add(field);
								}
								updatedPendingText = updatedPendingText.Replace("{{" + field.id + "}}", "{{" + field.label + "}}");
							}
							pendingField.decisionText = updatedPendingText;
							pendingField.decisionTextFields = JsonConvert.SerializeObject(updatedPendingTextFields);
							outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)] = pendingField;
						}
                    }
                    else if (pendingField.inputType.Value == "Table")
                    {
						if (pendingField.cellValues != null && pendingField.cellFields != null)
						{
							dynamic cellValues = JsonConvert.DeserializeObject(pendingField.cellValues.ToString());
							dynamic cellFields = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(pendingField.cellFields.ToString());
							var updatedCellFields = new Dictionary<string, dynamic>();
							foreach (KeyValuePair<string, dynamic> cellField in cellFields)
							{
								var newField = tablefields[cellField.Value.id.ToString()];
								cellValues[cellField.Key] = newField.label;
								updatedCellFields[cellField.Key] = newField;
							}
							pendingField.cellValues = cellValues;
							pendingField.cellFields = JsonConvert.SerializeObject(updatedCellFields);
							outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)] = pendingField;
						}
                    }
					else if (pendingField.inputType.Value == "Slider")
					{
						dynamic maxValuefld = (pendingField.maxValuefielddetails != null) ? JsonConvert.DeserializeObject(pendingField.maxValuefielddetails.ToString()) : null;
						dynamic minValuefld = (pendingField.minValuefielddetails != null) ? JsonConvert.DeserializeObject(pendingField.minValuefielddetails.ToString()) : null;
						dynamic stepValuefld = (pendingField.stepValuefielddetails != null) ? JsonConvert.DeserializeObject(pendingField.stepValuefielddetails.ToString()) : null;
						dynamic currentValuefld = (pendingField.currentValuefielddetails != null) ? JsonConvert.DeserializeObject(pendingField.currentValuefielddetails.ToString()) : null;
						foreach (var field in fields)
						{
							if (maxValuefld != null && maxValuefld.id == field.id)
							{								
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].maxValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].maxValuefrom = field.title;
							}
							if (minValuefld != null && minValuefld.id == field.id)
							{
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].minValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].minValuefrom = field.title;
							}
							if (stepValuefld != null && stepValuefld.id == field.id)
							{
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].stepValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].stepValuefrom = field.title;
							}
							if (currentValuefld != null && currentValuefld.id == field.id)
							{
								//maxValuefld.Add(field);
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].currentValuefielddetails = JsonConvert.SerializeObject(field);
								outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)].currentValuefrom = field.title;

							}

						}

					}
					if (pendingField["displayLogicRule"] != null && pendingField["displayLogicRule"] != "null")
                    {
                        pendingDisplayLogicRuleId = Convert.ToString(pendingField.displayLogicRule.Value);
                        pendingField["displayLogicRule"] = pendingDisplayLogicRuleId;
                        dynamic decisionDisplayLogicRule = direct.Rules.Where(x => x.Id == Guid.Parse(pendingDisplayLogicRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                        pendingField["displayLogicRuleDesc"] = decisionDisplayLogicRule.desc;
                        outputData.site.pendingPageFieldData[inputData.site.pendingPageFieldData.IndexOf(pendingFieldData)] = pendingField;
                    }
                }
				Dictionary<string, string> dataset_new = new Dictionary<string, string>();
				foreach (var fieldData in inputData.site.fieldData)
				{
					foreach (var fieldsArr in fieldData.fields)
					{
						foreach (var item in fieldsArr)
						{
							var fieldString = item.ToString();
							dynamic fieldDetails = JsonConvert.DeserializeObject(fieldString);

                            if (fieldDetails.inputType.Value == "Text Area")
                            {
                                string displayLogicRuleId = "";
                                dynamic optionsUpdated = fieldDetails;
                                if (fieldDetails["displayLogicRule"] != null && fieldDetails["displayLogicRule"] != "null")
                                {
                                    displayLogicRuleId = Convert.ToString(fieldDetails.displayLogicRule.Value);
                                    optionsUpdated["displayLogicRule"] = displayLogicRuleId;
                                    dynamic displayLogicRule = direct.Rules.Where(x => x.Id == Guid.Parse(displayLogicRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                                    optionsUpdated["displayLogicRuleDesc"] = displayLogicRule.desc;
                                }
                                outputData.site.fieldData[inputData.site.fieldData.IndexOf(fieldData)].fields[fieldData.fields.IndexOf(fieldsArr)][fieldsArr.IndexOf(item)] = optionsUpdated;
                            }

                            if (!(Convert.ToString(fieldDetails.inputType.Value) == "Text Area" || Convert.ToString(fieldDetails.inputType.Value) == "HTML Area" || Convert.ToString(fieldDetails.inputType.Value) == "Image"))
							{
								//string fieldId = (fieldDetails.fieldID==null)?null: Convert.ToString(fieldDetails.fieldID.Value);
        //                        string title = Convert.ToString(fieldDetails.title.Value);
        //                        string placeholder = Convert.ToString(fieldDetails.placeholder.Value);
								//string hint = Convert.ToString(fieldDetails.hint.Value);
								//bool isRequired = Convert.ToBoolean(fieldDetails.isRequired.Value);
								//bool displayLogic = Convert.ToBoolean(fieldDetails.displayLogic.Value);
								//int fieldWidth = Convert.ToInt32(fieldDetails.fieldWidth.Value);
								string fieldId = (fieldDetails.fieldID == null) ? GetFieldId(fieldDetails.id.Value) : Convert.ToString(fieldDetails.fieldID.Value);
								if (string.IsNullOrWhiteSpace(fieldId))
									continue;
								string title = (fieldDetails.title == null) ? "" : Convert.ToString(fieldDetails.title.Value);
								string placeholder = (fieldDetails.placeholder == null) ? "" : Convert.ToString(fieldDetails.placeholder.Value);
								string hint = (fieldDetails.hint == null) ? "" : Convert.ToString(fieldDetails.hint.Value);
								bool isRequired = (fieldDetails.isRequired == null) ? false : Convert.ToBoolean(fieldDetails.isRequired.Value);
								bool displayLogic = (fieldDetails.displayLogic == null) ? false : Convert.ToBoolean(fieldDetails.displayLogic.Value);
								int fieldWidth = (fieldDetails.fieldWidth == null) ? 1 : Convert.ToInt32(fieldDetails.fieldWidth.Value);


								if (string.IsNullOrWhiteSpace(fieldId))
									continue;
								dynamic optionsUpdated = direct.ClientEntityFields.Where(x => x.Id == Guid.Parse(fieldId)).Select(x => JObject.Parse(x.Options)).FirstOrDefault();
								 
								optionsUpdated.fieldID = fieldId;
                                optionsUpdated.title = title;
                                optionsUpdated.placeholder = placeholder;
								optionsUpdated.hint = hint;
								optionsUpdated.isRequired = isRequired;
								optionsUpdated.displayLogic = displayLogic;
								optionsUpdated.fieldWidth = fieldWidth;
								if (item.inputType.Value == "Text Input" || item.inputType.Value == "Dropdown" || item.inputType.Value == "Checkbox" || item.inputType.Value == "Listbox")
								{
									if (!dataset_new.ContainsKey(optionsUpdated.id.Value))
										dataset_new.Add(optionsUpdated.id.Value, "");
								}

								string isRequiredRuleId = "";
                                if (fieldDetails["isRequiredRule"] != null && fieldDetails["isRequiredRule"] != "null")
                                {
                                    isRequiredRuleId = Convert.ToString(fieldDetails.isRequiredRule.Value);
                                    optionsUpdated["isRequiredRule"] = isRequiredRuleId;
                                    dynamic isRequiredRule = direct.Rules.Where(x => x.Id == Guid.Parse(isRequiredRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                                    optionsUpdated["isRequiredRuleDesc"] = isRequiredRule.desc;
                                }

                                string displayLogicRuleId = "";
                                if (fieldDetails["displayLogicRule"] != null && fieldDetails["displayLogicRule"] != "null")
                                {
                                    displayLogicRuleId = Convert.ToString(fieldDetails.displayLogicRule.Value);
                                    optionsUpdated["displayLogicRule"] = displayLogicRuleId;
                                    dynamic displayLogicRule = direct.Rules.Where(x => x.Id == Guid.Parse(displayLogicRuleId)).Select(x => JObject.Parse(x.RuleDetail)).FirstOrDefault();
                                    optionsUpdated["displayLogicRuleDesc"] = displayLogicRule.desc;
                                }

                                if (optionsUpdated.inputType == "Dropdown" || optionsUpdated.inputType == "Listbox")
								{
									string fieldListId = Convert.ToString(optionsUpdated.fieldListId);
									List<dynamic> options = new List<dynamic>();
									direct.FieldListItems.Where(x => x.FieldListId == new Guid(fieldListId)).OrderBy(x => x.Ordinal).ToList().ForEach(opt =>
									{
										options.Add(new { Value = !string.IsNullOrWhiteSpace(opt.Value) ? opt.Value : opt.Display, Description = opt.Display });
									});
									string choices = JsonConvert.SerializeObject(options.ToArray());

									optionsUpdated.choices = JArray.Parse(choices);

								}
								outputData.site.fieldData[inputData.site.fieldData.IndexOf(fieldData)].fields[fieldData.fields.IndexOf(fieldsArr)][fieldsArr.IndexOf(item)] = optionsUpdated;
							}
						}
					}
				}
				string jsonString = FromDictionaryToJson(dataset_new);
				outputData.site.data = JObject.Parse(jsonString);
				outputData.dtLastUpdated = DateTime.Now;
				string updatedSiteInfo = JsonConvert.SerializeObject(outputData);
				site.Site = updatedSiteInfo;
				site.ActionStatus = "Saved";
				direct.SaveChanges();
				return Ok();
			}
			catch (Exception e)
			{
				//string t = test;
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		public string GetFieldId(string fldnameid)
		{
			try
			{
				
				var optionList = (from item
							  in direct.ClientEntityFields
								  where (item.ClientId == clientService.ClientId)
								  select new { options = JsonConvert.DeserializeObject(item.Options), item.Id }).ToList();

				for (int i = 0; i <= optionList.Count - 1; i++)
				{
					var fieldID = optionList[i].Id;
					dynamic strOption = JObject.Parse(optionList[i].options.ToString());
					//dynamic sitedetail = strOption.site;
					if (fldnameid == strOption.id.Value)
					{
						return fieldID.ToString();

					}

				}
				return null;
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return "fail";
			}
		}
		public string FromDictionaryToJson(Dictionary<string, string> dictionary)
		{
			var newstringdic = dictionary.Select(kvp => string.Format("\"{0}\":\"{1}\"", kvp.Key, string.Join(",", kvp.Value)));
			return string.Concat("{", string.Join(",", newstringdic), "}");
		}
		[AllowAnonymous]
		[HttpGet]
		[Route("ValidateCustomUrl/{customurl}/{siteId}")]
		public IActionResult ValidateCustomUrl(string customurl, Guid siteId)
		{
			try
			{
				var urlCnt = direct.Sites.Where(x => x.CustomUrl.ToLower() == customurl.ToLower() && x.Id != siteId && x.ClientId == clientService.ClientId).Count();
				if (urlCnt >= 1)
				{ return StatusCode(409, "A customUrl with name " + customurl + " already exists"); }
				else
					return Ok(siteId);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}

		}
		[AllowAnonymous]
		[HttpGet]
		[Route("ValidateSliderName/{slidername}")]
		public IActionResult ValidateSliderName(string slidername)
		{
			try
			{
				var siteInfo = direct.Sites.Where(x => x.ClientId == clientService.ClientId).Select(x => JsonConvert.DeserializeObject(x.Site)).ToList();
				for (int i = 0; i <= siteInfo.Count - 1; i++)
				{
					dynamic strOption = JObject.Parse(siteInfo[i].ToString());
                    dynamic sitedetail = strOption.site.decisionPageFieldData;
                    dynamic pendingdetail = strOption.site.pendingPageFieldData;
                    if (sitedetail != null)
                    {
                        foreach (var item in sitedetail)
                        {
                            if (item.inputType == "Slider")
                            {
                                string existname = item.id;
                                if (existname.ToLower() == slidername.ToLower())
                                {
                                    return StatusCode(409, "A slidername with name " + item.title + " already exists in decision page");
                                }
                            }
                        }
                    }
                    if (pendingdetail != null)
                    {
                        foreach (var penItem in pendingdetail)
                        {
                            if (penItem.inputType == "Slider")
                            {
                                string penExistname = penItem.id;
                                if (penExistname.ToLower() == slidername.ToLower())
                                {
                                    return StatusCode(409, "A slidername with name " + penItem.title + " already exists in pending page");
                                }
                            }
                        }
                    }

                    
                }
				return Ok();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}

		}
		[AllowAnonymous]
		[HttpGet]
		[Route("getSiteId/{customurl}")]
		public IActionResult GetSiteId(string customurl)
		{
			try
			{
				var siteId = direct.Sites.Where(x => x.CustomUrl.ToLower() == customurl.ToLower()).Select(x => x.Id).FirstOrDefault();
				if (siteId == Guid.Empty)
				{ siteId = new Guid(customurl); }
				return Ok(siteId);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}

		}
		[HttpPost]
		[Route("publish")]
		public async Task<IActionResult> PublishSite([FromBody] JToken jToken)
		{
			try
			{
				string site = jToken.ToString();
				dynamic siteObj = JObject.Parse(site);
				string id = siteObj.siteId;
				string versionTitle = siteObj.versionTitle;
				string versionComments = siteObj.versionComments;

				direct.SiteVersions.Where(x => x.SiteId == Guid.Parse(id)).ToList().ForEach(x => x.Active = false);
				await direct.SaveChangesAsync();

				var siteInfo = direct.Sites.Where(x => x.Id == Guid.Parse(id)).FirstOrDefault();
				int versionCount = direct.SiteVersions.Where(x => x.SiteId == Guid.Parse(id)).Count() + 1;
				direct.SiteVersions.Add(new SiteVersions() { Id = Guid.NewGuid(), SiteId = siteInfo.Id, Title = "V" + versionCount + ": " + versionTitle, Comments = versionComments, CreatedDate = DateTime.Now, UpdatedDate = DateTime.Now, SiteOptions = siteInfo.Site, Version = "V" + versionCount, Active = true });
				siteInfo.ActionStatus = "Published";
				siteInfo.CustomUrl = siteObj.customUrl;

				await direct.SaveChangesAsync();
				return Ok();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[HttpGet]
		[AllowAnonymous]
		[Route("siteversion/{id}/active/{isActive:bool?}")]
		public IActionResult GetActiveSiteVersion(string id, bool isActive = false)
		{
			try
            {
                bool dobSafariIssueFixArp62964 = this.configSettingKey?.DOBSafariIssueFixARP62964 != null && this.configSettingKey.DOBSafariIssueFixARP62964;
				bool mandatoryFieldBugARP65007 = this.configSettingKey?.MandatoryFieldBugARP65007 != null && this.configSettingKey.MandatoryFieldBugARP65007;
				dynamic results = null;
				if (isActive)
					results = (from item in direct.SiteVersions where item.SiteId == Guid.Parse(id) && item.Active == true select JObject.Parse(item.SiteOptions)).FirstOrDefault();
				else
					results = (from item in direct.SiteVersions where item.Id == Guid.Parse(id) select JObject.Parse(item.SiteOptions)).FirstOrDefault();
				if(results !=null)
				{
                    results.dobSafariIssueFixARP62964 = dobSafariIssueFixArp62964;
					results.mandatoryFieldBugARP65007 = mandatoryFieldBugARP65007;
				}
				return Ok(results);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
	
		[HttpGet]
		[Route("Versions/{siteId}")]
		public IActionResult GetVersions(Guid siteId)
		{
			try
			{
				var versions = from items in direct.SiteVersions where items.SiteId == Guid.Parse(siteId.ToString()) select items;
				var version_sort = versions.OrderByDescending(p => p.UpdatedDate);
				return Ok(version_sort);
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[HttpPost]
		[Route("Versions/{siteId}/{versionId}")]
		public IActionResult setVersionActive(Guid siteId, Guid versionId)
		{
			try
			{
				SiteVersions version = (from item in direct.SiteVersions where item.Id == Guid.Parse(versionId.ToString()) select item).FirstOrDefault();
				Sites site = (from item in direct.Sites.AsNoTracking() where item.Id == Guid.Parse(siteId.ToString()) select item).FirstOrDefault();

				site.Site = version.SiteOptions;
				direct.Sites.Update(site);

				//version.Active = true;
				version.UpdatedDate = DateTime.Now;
				direct.SiteVersions.Update(version);

				direct.SaveChanges();

				return Ok();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}

		private async Task LogReportData(DataLog log)
		{
            try
            {
                _logWriter.LogInformation($"Started transactionLogger for LogReportData with Application Number :  {(log != null ? log.ApplicationNumber : string.Empty)}");
                transactionLogger.Create(log);
            }
            catch (Exception e)
            {
                _logWriter.LogError(e, e.Message);
            }
			try
			{
                _logWriter.LogInformation($"Started adding data in database for Application Number :  {(log != null ? log.ApplicationNumber : string.Empty)}");
                direct.DataLog.Add(log);
				await direct.SaveChangesAsync();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e, e.Message);
			}
		}
		private async Task LogAppData(Apps app)
		{
            try
            {
                _logWriter.LogInformation($"Started transactionLogger for LogAppData with Application Number : {(app != null ? app.ApplicationNumber : string.Empty)}");
                transactionLogger.Create(app);
            }
            catch (Exception e)
            {                
                _logWriter.LogError(e, e.Message);
            }
			try
			{
                _logWriter.LogInformation($"Started updating data in database for Application Number : {(app != null ? app.ApplicationNumber : string.Empty)}");
                direct.Apps.Update(app);
				await direct.SaveChangesAsync();
			}
			catch (Exception e)
			{
				_logWriter.LogError(e, e.Message);
			}
		}

        private async Task LogAppData(Guid appId)
        {
            try
            {
                Apps application = (from item in direct.Apps.AsNoTracking() where item.Id == Guid.Parse(appId.ToString()) select item).FirstOrDefault();
                if (application != null)
                {
                    await LogAppData(application);
                }
            }
            catch (Exception e)
            {
                _logWriter.LogError(e, e.Message);
            }
        }
       
        public string BuildXml(dynamic siteSettings, Dictionary<string, object> entity)
		{

			foreach (var item in siteSettings)
			{
				string elementName = item.Name;
				string _elementName = elementName.ToLower();
				if (_elementName == "ssc" || _elementName == "dealerid" || _elementName == "sourcesystemcode")
				{
					var value = ((JValue)item.Value).Value;
					if (_elementName == "ssc" || _elementName == "sourcesystemcode")
					{ _elementName = "SourceSystemCode"; }
					else if (_elementName == "dealerid")
					{ _elementName = "DealerId"; }
					if (!entity.ContainsKey(_elementName))
						entity.Add(_elementName, value);
					else
					{
						entity[_elementName] = ((JValue)item.Value).Value;
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
			return xml;
		}
		[HttpPost]
		[Route("resendToLos/{submitFromPage}/{appNum}/{appId}/{siteId}")]
		[AllowAnonymous]
		public async Task<IActionResult> Resubmit_Los(string submitFromPage, string appNum, Guid appId, Guid siteId, [FromBody] List<SliderList> data)
		{
			try
			{
				string referer = Request.Headers["Referer"].ToString();
				var entity = new Dictionary<string, object>();
                entity.Add("SubmitFromPage", submitFromPage);
				entity.Add("ApplicationNumber", appNum);
				entity.Add("AppId", appId);

				if (data != null)
				{
					foreach (var item in data)
					{
						entity.Add(item.Id, item.Currentval);
					}
				}
					//string fields = data.ToString();
					//var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(data.ToString())["fields"];
					//var input = ((JArray)values).Children();
					//foreach (var item in input)
					//{
					//	if (item["inputType"].ToString() == "Slider")
					//	{ entity.Add(item["id"].ToString(), item["currentValue"].ToString()); }

					//}

				var siteResult = (from item in direct.Sites where item.Id == siteId select item).First();
				if (siteResult == null)
					throw new NullReferenceException("Site not found for id: " + siteId);

				if (string.IsNullOrEmpty(siteResult.Site))
					return Ok();

				dynamic siteInfo = JsonConvert.DeserializeObject(siteResult.Site);
				dynamic siteDetails = siteInfo.site;

				dynamic siteSettings = siteDetails.settings;

				string _updateUrl = (string)siteSettings.updateUrl;
				string updateUrl = _updateUrl.Replace("{AppNumber}", appNum);

				if (siteSettings != null && siteSettings.ContainsKey("updateUrl"))
				{

					var xml = BuildXml(siteSettings,entity);					
					var httpClient = new BasicHttpClient(updateUrl);
					var results = await httpClient.PostXml(xml);					
					XmlDocument document = new XmlDocument();
					document.LoadXml(results);
				
					string result = "Success";
					try
						{
							result = document.SelectSingleNode("custom_ack/result").InnerText;
							if (result.ToLower() == "true")
							{
								result = "Success";							
							}
							else
							{
								result = "Failure";
							}
						}
					catch (Exception e)
						{
							_logWriter.LogWarning($"custom_ack/result xpath not found: {e.Message}");
						}


					Apps application = (from item in direct.Apps.AsNoTracking() where item.Id == Guid.Parse(appId.ToString()) select item).FirstOrDefault();
					if (application != null)
					{
						application.DecisionData = encryption.Encrypt(results);						
						application.UpdateDate = DateTime.Now;						
						direct.Apps.Update(application);
						await direct.SaveChangesAsync();
					}

					XmlNode newRoot = document.CreateElement("Results");

					if (document.DocumentElement != null)
					{
						foreach (XmlNode childNode in document.DocumentElement.ChildNodes)
						{
							newRoot.AppendChild(childNode.CloneNode(true));
						}				

						await Task.Run(() => LogReportData(new DataLog { Id = Guid.NewGuid(), ClientId = clientService.ClientId, ClientPageUrl = referer, AppId = appId, TimeStamp = DateTime.Now, RequestStatus = result, ErrorSummary = "", FromPreview = false, Active = false, Published = true, AppSubmitURL = updateUrl, ApplicationNumber = appNum }));
                        await Task.Run(() => LogAppData(application));
						return Ok(newRoot);
					}
			}
				return BadRequest();
			}
		catch (Exception e)
			{
				string referer = Request.Headers["Referer"].ToString();
				await Task.Run(() => LogReportData(new DataLog { Id = Guid.NewGuid(), ClientId = clientService.ClientId, ClientPageUrl = referer, AppId = appId, TimeStamp = DateTime.Now, RequestStatus = "Error", ErrorSummary = e.Message}));
				_logWriter.LogError(e.Message);
				return BadRequest();
			}
		}
		[Route("ValidateStepName/{newStepName}/{siteId}")]
		public IActionResult ValidateStepName(string newStepName, Guid siteId)
		{

			string _newFieldName = (newStepName.ToUpper()).ToString();
			var optionList = direct.Sites.Where(x => x.ClientId == clientService.ClientId && x.Id == siteId).Select(x => JsonConvert.DeserializeObject(x.Site)).FirstOrDefault();
			if (optionList != null)
			{


				dynamic strOption = JObject.Parse(optionList.ToString());
				dynamic sitedetail = strOption.site.steps;
				foreach (var item in sitedetail)
				{
					string currentstpname = item.label;
					if (currentstpname.ToLower() == _newFieldName.ToLower())
					{
						return StatusCode(409, "A step with name " + newStepName + " already exists");
					}
				}
				return Ok(siteId);				
			}
			else
				return BadRequest();
		}
	}


}
