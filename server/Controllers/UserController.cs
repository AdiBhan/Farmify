using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;
using FarmifyService.models;
using FarmifyService.Data;

namespace FarmifyService.Controllers 
{
    [Route("api/users/")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(ApplicationDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("oauth/login")]
        public IActionResult LoginWithGoogle()
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "/success"
            }, GoogleDefaults.AuthenticationScheme);
        }
[HttpPost("register")]
public async Task<IActionResult> Register()
{
    var strategy = _context.Database.CreateExecutionStrategy();

    return await strategy.ExecuteAsync(async () =>
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();
            _logger.LogInformation($"Received registration request with body: {body}");

            var jsonDocument = JsonDocument.Parse(body);
            var root = jsonDocument.RootElement;

            if (!root.TryGetProperty("email", out var emailElement) || string.IsNullOrWhiteSpace(emailElement.GetString()))
            {
                _logger.LogWarning("Email is missing or empty");
                return BadRequest("Email is required and cannot be empty");
            }

            var email = emailElement.GetString() ?? string.Empty;

            if (!root.TryGetProperty("username", out var usernameElement) || string.IsNullOrWhiteSpace(usernameElement.GetString()))
            {
                _logger.LogWarning("Username is missing or empty");
                return BadRequest("Username is required and cannot be empty");
            }

            var username = usernameElement.GetString() ?? string.Empty;

            _logger.LogInformation($"Checking for existing user with email: {email} or username: {username}");

            var existingUser = await _context.Users
                .AsNoTracking()
                .Where(u => u.Email.ToLower() == email.ToLower() || u.Username.ToLower() == username.ToLower())
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                if (existingUser.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogInformation($"User with email {email} already exists");
                    return BadRequest(new { message = "User with this email already exists" });
                }

                if (existingUser.Username.Equals(username, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogInformation($"User with username {username} already exists");
                    return BadRequest(new { message = "User with this username already exists" });
                }
            }

            var password = root.TryGetProperty("password", out var passwordElement) ? 
                passwordElement.GetString() ?? string.Empty : string.Empty;

            var accountType = root.TryGetProperty("accountType", out var accountTypeElement) ? 
                accountTypeElement.GetString() ?? string.Empty : string.Empty;

            _logger.LogInformation("Creating new user object");
            var newUser = new User
            {
                Email = email,
                Username = username,
                Password = password,
                sessionID = Guid.NewGuid().ToString(),
                Credits = 0,
                AccountType = accountType
            };

            _logger.LogInformation("Adding user to context");
            await _context.Users.AddAsync(newUser);

            _logger.LogInformation("Saving changes");
            var saveResult = await _context.SaveChangesAsync();
            _logger.LogInformation($"SaveChanges result: {saveResult}");

            await transaction.CommitAsync();
            _logger.LogInformation("Transaction committed");

            return Ok(new {
                message = "User registered successfully.",
                data = new {
                    id = newUser.ID,
                    email = newUser.Email,
                    username = newUser.Username,
                    sessionId = newUser.sessionID,
                    credits = newUser.Credits,
                    accountType = newUser.AccountType
                }
            });
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _logger.LogError($"Database update error: {dbEx.Message}");
            _logger.LogError($"Inner exception: {dbEx.InnerException?.Message}");
            return StatusCode(500, new { message = "Failed to create user", error = dbEx.Message });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError($"Unexpected error: {ex.Message}");
            _logger.LogError($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    });
}
    }
};