using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Defi.Direct.Domain.Models;
using Defi.Direct.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;

namespace Defi.Direct.Api.Controllers
{
    [Route("api/User")]
    [ApiController]
    [Authorize(AuthenticationSchemes = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme)]
    [EnableCors("CorsPolicy")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IClientService clientService;

        public UserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager, IClientService clientService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this.clientService = clientService;
        }

        [HttpPost]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody]JToken request)
        {
            try
            {
                var clientId = clientService.ClientId;
                string username = request["username"].ToString();
                string passwordold = request["passwordold"].ToString();
                string passwordnew = request["passwordnew"].ToString();
                var claim = from item in User.Claims
                            where item.Subject.Name == OpenIddictConstants.Claims.Subject
                            select item;
                string fullUsername = $"{username}_{clientId.ToString().ToLower()}";
                var user = await userManager.FindByNameAsync(fullUsername);
                if (user == null)
                    return BadRequest("Username not found");
                var result = await userManager.ChangePasswordAsync(user, passwordold, passwordnew);
                if (result.Succeeded)
                    return Ok();
                else
                    return BadRequest(result.Errors.First().Description);
            }
            catch (Exception)
            {
                return BadRequest("Error parsing request");
            }
        }
        [HttpPost]
        [Route("AdminResetPassword")]
        public async Task<IActionResult> AdminResetPassword([FromBody]JToken request)
        {
            try
            {
                bool ValidUser = await CheckUserRoleAsync();
                if (ValidUser)
                {
                    var clientId = clientService.ClientId;
                    string username = request["username"].ToString();
                    string passwordnew = request["passwordnew"].ToString();
                    var existingUser = await userManager.FindByNameAsync(username + "_" + clientId.ToString().ToLower());
                    if (existingUser == null)
                        return BadRequest("Username not found");
                    var token = await userManager.GeneratePasswordResetTokenAsync(existingUser);
                    var result = await userManager.ResetPasswordAsync(existingUser, token, passwordnew);
                    if (result.Succeeded)
                        return Ok("Password Reset succeeded.");
                    else
                        return BadRequest("Error resetting password");
                }
                else
                {
                    return BadRequest("You are not an admin to do this operation");
                }
            }
            catch (Exception)
            {
                return BadRequest("Error resetting password");
            }
        }

        [HttpGet]
        [Route("UserInfo")]
        public async Task<IActionResult> UserInfoAsync()
        {
            dynamic userInfo = new ExpandoObject();
            var userId = (from item in User.Claims
                         where item.Type == OpenIddictConstants.Claims.Subject
                         select item.Value).FirstOrDefault();
            if (userId != null)
            {
                var user = await userManager.FindByIdAsync(userId);
                userInfo.roles = await userManager.GetRolesAsync(user);
                if (user != null)
                {
                    userInfo.username = user.UserName.Split("_")[0];
                    return Ok(JsonConvert.SerializeObject(userInfo));
                }
            }
            return BadRequest("user not found");
            
        }

        [HttpPost]
        [Route("AddUser")]
        public async Task<IActionResult> AddUser([FromBody]JToken request)
        {
            try
            {
                bool ValidUser = await CheckUserRoleAsync();
                if (ValidUser)
                { 
                    var clientId = clientService.ClientId;                
                    string username = request["username"].ToString();
                    var existingUser = await userManager.FindByNameAsync(username + "_" + clientId);
                    if(existingUser != null)
                    {
                        return BadRequest("User already exists with this username");
                    }
                    string password = request["password"].ToString();
                    string role = request["role"].ToString();
                    string email = request["email"].ToString();
                    var user = new ApplicationUser() { UserName = username+"_"+clientId, Email = email };
                    var result = await userManager.CreateAsync(user, password);
                    if (result.Succeeded)
                    {
                        var roleresult = await userManager.AddToRoleAsync(user, role);
                        return Ok("User added successfully.");
                    }
                    else
                    {
                        return BadRequest(result.Errors.First().Description);
                    }
                }
                else
                {
                    return BadRequest("You are not an admin to do this operation");
                }
            }
            catch (Exception)
            {
                return BadRequest("Error parsing request");
            }
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<IActionResult> DeleteUser([FromBody]JToken request)
        {
            try
            {
                bool ValidUser = await CheckUserRoleAsync();
                if (ValidUser)
                {
                    var clientId = clientService.ClientId;
                    string username = request["username"].ToString();
                    var existingUser = await userManager.FindByNameAsync(username + "_" + clientId);
                    if (existingUser == null)
                    {
                        return BadRequest("User does not exists with this username");
                    }
                    var result = await userManager.DeleteAsync(existingUser);
                    if (result.Succeeded)
                    {
                        return Ok("User deleted successfully ");
                    }
                    else
                    {
                        return BadRequest(result.Errors.First().Description);
                    }
                }
                else
                {
                    return BadRequest("You are not an admin to do this operation");
                }
            }
            catch (Exception)
            {
                return BadRequest("Error parsing request");
            }
        }

        [HttpGet]
        [Route("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                bool ValidUser = await CheckUserRoleAsync();
                if (ValidUser)
                {
                    var clientId = clientService.ClientId;
                    var userlist = new List<ExpandoObject>();
                    var result = await (from item in userManager.Users where item.UserName.EndsWith(clientId.ToString()) select item).ToListAsync();
                    foreach(var user in result)
                    {
                        dynamic cuser = new ExpandoObject();
                        cuser.UserName = user.UserName.ToString().Split("_")[0];
                        cuser.Email = user.Email;
                        IList<string> roles = await userManager.GetRolesAsync(user);
                        if(roles != null)
                        {
                            cuser.Role = roles[0];
                        }
                        else
                        {
                            cuser.Role = "";
                        }
                        userlist.Add(cuser);
                    }                
                    return Ok(JsonConvert.SerializeObject(userlist));
                }
                else
                {
                    return BadRequest("You are not an admin to do this operation");
                }
            }
            catch (Exception)
            {
                return BadRequest("Error parsing request");
            }
        }

        public async Task<bool> CheckUserRoleAsync()
        {
            dynamic _roles;
            dynamic userInfo = new ExpandoObject();
            dynamic currentrolename = null;
            var userId = (from item in User.Claims
                          where item.Type == OpenIddictConstants.Claims.Subject
                          select item.Value).FirstOrDefault();
            if (userId != null)
            {
                var _user = await userManager.FindByIdAsync(userId);
                if (_user != null)
                {
                    _roles = await userManager.GetRolesAsync(_user);
                    if (_roles != null)
                        currentrolename = _roles[0];
                    if (currentrolename == "Admin")
                        return true;
                    else
                        return false;
                }
            }
            return false;
        }
    }
}