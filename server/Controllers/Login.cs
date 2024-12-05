using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace FarmifyService.Controllers
{
    // Defines a controller for handling login functionality
    [Route("login")] // Sets the route for this controller to "/login"
    public class LoginController : Controller
    {
        // GET: /login
        // Initiates the login process using Google authentication
        [HttpGet]
        public IActionResult Login()
        {
            // Initiates an authentication challenge using Google's authentication scheme
            // Redirects the user to Google's login page and, upon successful login,
            // redirects them back to the root URL ("/")
            return Challenge(
                new AuthenticationProperties { RedirectUri = "/" }, // Set the post-login redirect URI
                GoogleDefaults.AuthenticationScheme // Use Google as the authentication provider
            );
        }
    }
}
