using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Elements.Domain;


namespace Elements.Domain
{

	public interface IHttpClient
	{
		Task<string> PostXml(string xmlString);
	}

	public class BasicHttpClient : IHttpClient
	{
		private string _url;
		public BasicHttpClient(string url)
		{
			_url = url;
		}

		public async Task<string> PostXml(string xmlString)
		{
			using (var client = new HttpClient())
			{
				ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
				System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, errors) => { return true; };
				var httpContent = new StringContent(xmlString, Encoding.UTF8, "application/xml");

				var result = await client.PostAsync(_url, httpContent);
				if (result.StatusCode != HttpStatusCode.OK)
				{
					string errorResultContent = await result.Content.ReadAsStringAsync();
					throw new Exception(string.Format("Error posting xml:{0} {1}to: {2} {1}response: {3}", xmlString, Environment.NewLine, _url, errorResultContent));
				}

				string resultContent = await result.Content.ReadAsStringAsync();

				return resultContent;
			}
		}

	}




}
