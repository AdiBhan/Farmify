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
    [HttpPost("login")]
    public async Task<IActionResult> Login()
    {
        var strategy = _context.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                _logger.LogInformation($"Received login request with body: {body}");

                var jsonDocument = JsonDocument.Parse(body);
                var root = jsonDocument.RootElement;

                var email = root.TryGetProperty("email", out var emailElement) ? emailElement.GetString() ?? string.Empty : string.Empty;
                var password = root.TryGetProperty("password", out var passwordElement) ? passwordElement.GetString() ?? string.Empty : string.Empty;

                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    _logger.LogWarning("Email or password is missing");
                    return BadRequest("Email and password are required");
                }

                _logger.LogInformation($"Searching for user with email: {email}");
                
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email); 

                if (user == null || user.Password != password)
                {
                    _logger.LogWarning("Invalid email or password");
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                _logger.LogInformation($"User {user.Email} logged in successfully");

                // Updating session ID
                string newSessionId = Guid.NewGuid().ToString();
                user.sessionID = newSessionId;
                await _context.SaveChangesAsync();

                // Retrieve Buyer or Seller ID based on AccountType
                string? buyerId = null;
                string? sellerId = null;

                if (user.AccountType.Equals("buyer", StringComparison.OrdinalIgnoreCase))
                {
                    var buyer = await _context.Buyers.FirstOrDefaultAsync(b => b.UserID == user.ID);
                    if (buyer != null)
                    {
                        buyerId = buyer.ID;
                    }
                }
                else if (user.AccountType.Equals("seller", StringComparison.OrdinalIgnoreCase))
                {
                    var seller = await _context.Sellers.FirstOrDefaultAsync(s => s.UserID == user.ID);
                    if (seller != null)
                    {
                        sellerId = seller.ID;
                    }
                }

                await transaction.CommitAsync();
                _logger.LogInformation("Transaction committed for login");

                return Ok(new
                {
                    message = "Login successful",
                    data = new
                    {
                        id = user.ID,
                        email = user.Email,
                        username = user.Username,
                        sessionId = newSessionId,
                        credits = user.Credits,
                        accountType = user.AccountType,
                        buyerId, // Add buyerId
                        sellerId // Add sellerId
                    }
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Unexpected error during login: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        });
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

            var username = root.TryGetProperty("username", out var usernameElement) ? usernameElement.GetString() ?? string.Empty : string.Empty;
            if (string.IsNullOrWhiteSpace(username))
            {
                _logger.LogWarning("Username is missing or empty");
                return BadRequest("Username is required and cannot be empty");
            }

            _logger.LogInformation($"Checking for existing user with email: {email} or username: {username}");

            var existingUser = await _context.Users
                .AsNoTracking()
                .Where(u => u.Email.ToLower() == email.ToLower())
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

            _logger.LogInformation($"Creating new user object. Email: {email}, Username: {username}, Password: {password}, Account Type: {accountType}");

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
            await _context.SaveChangesAsync();

            string newId = Guid.NewGuid().ToString();

            if (accountType.Equals("buyer", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Creating buyer account");
                var newBuyer = new Buyer
                {
                    ID = newId,
                    UserID = newUser.ID,
                    Address = "Default Address", // Replace with actual data
                    Status = "Active",
                    PhoneNumber = "000-000-0000" // Replace with actual data
                };
                await _context.Buyers.AddAsync(newBuyer);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new
                {
                    message = "User registered successfully.",
                    data = new
                    {
                        id = newUser.ID,
                        email = newUser.Email,
                        username = newUser.Username,
                        sessionId = newUser.sessionID,
                        credits = newUser.Credits,
                        accountType = newUser.AccountType,
                        buyerId = newBuyer.ID
                    }
                });
            }
            else if (accountType.Equals("seller", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Creating seller account");
                var newSeller = new Seller
                {
                    ID = newId,
                    UserID = newUser.ID,
                    Address = "Default Address", // Replace with actual data
                    Description = "Default Description", // Replace with actual data
                    SellerName = username, // Example use, adjust as needed
                    PPID = "DefaultPPID", // Replace with actual data
                    PPsecret = "DefaultPPSecret" // Replace with actual data
                };
                await _context.Sellers.AddAsync(newSeller);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new
                {
                    message = "User registered successfully.",
                    data = new
                    {
                        id = newUser.ID,
                        email = newUser.Email,
                        username = newUser.Username,
                        sessionId = newUser.sessionID,
                        credits = newUser.Credits,
                        accountType = newUser.AccountType,
                        sellerId = newSeller.ID
                    }
                });
            }

            await transaction.CommitAsync();
            return Ok(new
            {
                message = "User registered successfully, but no buyer/seller account was created.",
                data = new
                {
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
            return StatusCode(500, new { message = "Failed to create user", error = dbEx.Message });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError($"Unexpected error: {ex.Message}");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    });
}


[HttpPut("update")]
public async Task<IActionResult> UpdateUser()
{
    var strategy = _context.Database.CreateExecutionStrategy();

    return await strategy.ExecuteAsync(async () =>
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();
            _logger.LogInformation($"Received update request with body: {body}");

            var jsonDocument = JsonDocument.Parse(body);
            var root = jsonDocument.RootElement;

            var sessionID = root.TryGetProperty("sessionID", out var sessionIdElement) ? 
                sessionIdElement.GetString() ?? string.Empty : string.Empty;

            if (string.IsNullOrWhiteSpace(sessionID))
            {
                _logger.LogWarning("Session ID is missing");
                return BadRequest("Session ID is required");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                _logger.LogWarning($"No user found with session ID: {sessionID}");
                return NotFound(new { message = "User not found" });
            }

            if (root.TryGetProperty("email", out var emailElement))
            {
                var email = emailElement.GetString();
                if (!string.IsNullOrWhiteSpace(email))
                {
                    _logger.LogInformation($"Updating email for user with session ID: {sessionID}");
                    user.Email = email;
                }
            }

            if (root.TryGetProperty("username", out var usernameElement))
            {
                var username = usernameElement.GetString();
                if (!string.IsNullOrWhiteSpace(username))
                {
                    _logger.LogInformation($"Updating username for user with session ID: {sessionID}");
                    user.Username = username;
                }
            }

            if (root.TryGetProperty("password", out var passwordElement))
            {
                var password = passwordElement.GetString();
                if (!string.IsNullOrWhiteSpace(password))
                {
                    _logger.LogInformation($"Updating password for user with session ID: {sessionID}");
                    user.Password = password;
                }
            }

            _logger.LogInformation("Saving changes to the database");
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            _logger.LogInformation("Transaction committed for update");

            return Ok(new
            {
                message = "User updated successfully",
                data = new
                {
                    id = user.ID,
                    email = user.Email,
                    username = user.Username,
                    sessionId = user.sessionID
                }
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError($"Unexpected error during update: {ex.Message}");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    });
}

    }
}