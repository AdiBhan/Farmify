using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;

namespace YourNamespace.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class UserController : Controller
    {
        /// <summary>
        /// Initiates Google OAuth login process.
        /// </summary>
        [HttpGet("oauth/login")]
        public IActionResult LoginWithGoogle()
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "/success"
            }, GoogleDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// Handles user registration with JSON body containing user data.
        /// </summary>
        [HttpPost("client/register")]
        public async Task<IActionResult> Register()
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var body = await reader.ReadToEndAsync();
                var registerData = JsonSerializer.Deserialize<RegisterModel>(body);

                // Perform registration logic (e.g., save user to database)

                return Ok(new { message = "User registered successfully.", data = registerData });
            }
        }

        // Define models for registration and login
        public class RegisterModel
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}
