using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace YourNamespace.Controllers
{
    [Route("login")]
      /// Controller responsible for handling user authentication via Google OAuth
    public class LoginController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return Challenge(new AuthenticationProperties { 

            // Redirects user to /sucess endpoint after they sign in/register with Google Auth
                RedirectUri = "/success" }, 
                GoogleDefaults.AuthenticationScheme);
        }
    }
}
