using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Defi.Direct.Domain.Models
{
    public static class ApplicationDbInitializer
    {
        public static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            SetupUser(userManager, new Guid("FA93B8F3-1925-49BF-8F8A-C793CB87A6C8"), "admin", "Defirocks2018!", "Admin");
            SetupUser(userManager, new Guid("a3f4f82a-8e96-4489-85a8-3a93e0767e89"), "admin", "Defirocks2018!", "Admin");
        }

        public static void SetupUser(UserManager<ApplicationUser> userManager, Guid clientId, string username, string password, string role)
        {
            string fullUsername = $"{username}_{clientId.ToString().ToLower()}";
            var user = userManager.FindByNameAsync(fullUsername).Result;
            bool success = true;
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = fullUsername
                };

                IdentityResult result = userManager.CreateAsync(user, password).Result;
                success = result.Succeeded;
                if (result.Succeeded)
                {
                    user = userManager.FindByNameAsync(fullUsername).Result;
                }

            }
            if (success)
            {
                var roles = userManager.GetRolesAsync(user).Result;
                if (!roles.Contains(role))
                    userManager.AddToRoleAsync(user, role).Wait();
            }
        }

        public static void SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            var role = roleManager.FindByNameAsync("Admin").Result;
            if (role == null)
                roleManager.CreateAsync(new IdentityRole { Name = "Admin", NormalizedName = "Admin".ToUpper() });
            role = roleManager.FindByNameAsync("User").Result;
            if (role == null)
                roleManager.CreateAsync(new IdentityRole { Name = "User", NormalizedName = "User".ToUpper() });
        }
    }
}
