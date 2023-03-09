using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("/connect")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private IClientService clientService;
        private directContext direct;
       public AuthorizationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IClientService clientService, directContext direct)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.direct = direct;
            this.clientService = clientService;
        }

        [HttpPost]
        [Route("token")]
        [Produces("application/json")]
        public async Task<IActionResult> ExchangeAsync()
        {
	        var request = HttpContext.GetOpenIddictServerRequest();
          
            if (request.IsPasswordGrantType())
            {
	            var username = $"{request.Username}_{clientService.ClientId.ToString().ToLower()}";
                // Validate the user credentials.
                // Note: to mitigate brute force attacks, you SHOULD strongly consider
                // applying a key derivation function like PBKDF2 to slow down
                // the password validation process. You SHOULD also consider
                // using a time-constant comparer to prevent timing attacks.
                var user = await userManager.FindByNameAsync(username);
                if (user != null)
                {
                    var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, true);
                    if (!result.Succeeded)
                    {
                        return Forbid(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
                    }

					var claims = new List<Claim>();
					claims.Add(new Claim(OpenIddictConstants.Claims.Subject, user.Id));
					var identity = new ClaimsIdentity(claims, "OpenIddict");
					var principal = new ClaimsPrincipal(identity);
                    
					var ticket = new AuthenticationTicket(principal,
						new AuthenticationProperties() { AllowRefresh = true, IsPersistent = true },
						OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
					principal.SetScopes(OpenIddictConstants.Scopes.OfflineAccess);
					return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
				}

                return Forbid(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
               
	            var info = await HttpContext.AuthenticateAsync(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
               
	            var id = (from item in info.Principal.Claims
	                where item.Type == OpenIddictConstants.Claims.Subject
	                select item.Value).FirstOrDefault();
                // Retrieve the user profile corresponding to the authorization code/refresh token.
                // Note: if you want to automatically invalidate the authorization code/refresh token
                // when the user password/roles change, use the following line instead:
                
                var username = $"{request.Username}_{clientService.ClientId.ToString().ToLower()}";
                if (id == null)
                {
	                return Forbid(
		                authenticationSchemes: OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
		                properties: new AuthenticationProperties(new Dictionary<string, string>
		                {
			                [OpenIddictServerAspNetCoreConstants.Properties.Error] = OpenIddictConstants.Errors.InvalidGrant,
			                [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The token is no longer valid."
		                }));
                }
                var user = await userManager.FindByIdAsync(id);
                if (user == null)
                {
	                return Forbid(
		                authenticationSchemes: OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
		                properties: new AuthenticationProperties(new Dictionary<string, string>
		                {
			                [OpenIddictServerAspNetCoreConstants.Properties.Error] = OpenIddictConstants.Errors.InvalidGrant,
			                [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The token is no longer valid."
		                }));
                }

                // Ensure the user is still allowed to sign in.
                if (!await signInManager.CanSignInAsync(user))
                {
	                return Forbid(
		                authenticationSchemes: OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
		                properties: new AuthenticationProperties(new Dictionary<string, string>
		                {
			                [OpenIddictServerAspNetCoreConstants.Properties.Error] = OpenIddictConstants.Errors.InvalidGrant,
			                [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The user is no longer allowed to sign in."
		                }));
                }

                //// Create a new authentication ticket, but reuse the properties stored in the
                //// authorization code/refresh token, including the scopes originally granted.
				var claims = new List<Claim>();
				claims.Add(new Claim(OpenIddictConstants.Claims.Subject, user.Id));
				var identity = new ClaimsIdentity(claims, "OpenIddict");
	            var principal = new ClaimsPrincipal(identity);

	            var ticket = new AuthenticationTicket(principal,
				 new AuthenticationProperties() { AllowRefresh = true, IsPersistent = true },
				 OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
				principal.SetScopes();
				return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);

            }
            throw new InvalidOperationException("The specified grant type is not supported.");
        }

        [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme), HttpGet("success")]
        public async Task<IActionResult> Success()
        {
            var request = Request;
            string input = "";
            using (StreamReader reader = new StreamReader(request.Body, Encoding.UTF8))
            {

                input = await reader.ReadToEndAsync();
            }

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("HEADERS");
            foreach (var header in request.Headers)
            {
                sb.AppendLine($"{header.Key} = {header.Value}");
            }
            sb.AppendLine("COOKIES");
            foreach (var cookie in request.Cookies)
            {
                sb.AppendLine($"{cookie.Key} = {cookie.Value}");
            }
            sb.AppendLine("BODY");
            sb.AppendLine(input);
            sb.AppendLine("CLAIMS");

            var cl = ((System.Security.Claims.ClaimsIdentity)User.Identity);
            foreach (var claim in cl.Claims)
            {
                sb.AppendLine($"{claim.Subject} = {claim.Value}");
            }

            return Ok(sb.ToString());
        }

        private IEnumerable<string> GetDestinations(Claim claim, ClaimsPrincipal principal)
        {
	        // Note: by default, claims are NOT automatically included in the access and identity tokens.
	        // To allow OpenIddict to serialize them, you must attach them a destination, that specifies
	        // whether they should be included in access tokens, in identity tokens or in both.

	        switch (claim.Type)
	        {
		        case OpenIddictConstants.Claims.Name:
			        yield return OpenIddictConstants.Destinations.AccessToken;

			        if (principal.HasScope(OpenIddictConstants.Permissions.Scopes.Profile))
				        yield return OpenIddictConstants.Destinations.IdentityToken;

			        yield break;

		        case OpenIddictConstants.Claims.Email:
			        yield return OpenIddictConstants.Destinations.AccessToken;

			        if (principal.HasScope(OpenIddictConstants.Permissions.Scopes.Email))
				        yield return OpenIddictConstants.Destinations.IdentityToken;

			        yield break;

		        case OpenIddictConstants.Claims.Role:
			        yield return OpenIddictConstants.Destinations.AccessToken;

			        if (principal.HasScope(OpenIddictConstants.Permissions.Scopes.Roles))
				        yield return OpenIddictConstants.Destinations.IdentityToken;

			        yield break;

		        // Never include the security stamp in the access and identity tokens, as it's a secret value.
		        case "AspNet.Identity.SecurityStamp": yield break;

		        default:
			        yield return OpenIddictConstants.Destinations.AccessToken;
			        yield break;
	        }
        }

    }
}