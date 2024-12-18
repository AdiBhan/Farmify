using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using FarmifyService.Data;
using FarmifyService.models;
using System.Linq;
using System.Text.Json;

namespace FarmifyService.Controllers
{
    [ApiController]
    [Route("api/seller")]
    public class SellerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SellerController> _logger;

        public SellerController(ApplicationDbContext context,ILogger<SellerController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Fetch seller account details
        [HttpGet("account")]
        public async Task<IActionResult> GetSellerAccount([FromHeader] string sessionID)
        {
            if (string.IsNullOrWhiteSpace(sessionID))
                return BadRequest(new { message = "Session ID is required" });

            var seller = await _context.Sellers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.User.sessionID == sessionID);

            if (seller == null)
                return NotFound(new { message = "Seller not found" });

            return Ok(new
            {
                data = new
                {
                    email = seller.User.Email,
                    id = seller.ID,
                    phoneNumber = seller.User.PhoneNumber,
                    paypalID = seller.PPID,
                    paypalSecret = seller.PPsecret
                }
            });
        }

        // Update seller account details
        [HttpPut("account")]
        public async Task<IActionResult> UpdateSellerAccount([FromHeader] string sessionID, [FromBody] UpdateAccountModel model)
        {
            
            if (string.IsNullOrWhiteSpace(sessionID))
                return BadRequest(new { message = "Session ID is required" });

            var seller = await _context.Sellers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.User.sessionID == sessionID);

            if (seller == null)
                return NotFound(new { message = "Seller not found" });

            if (!string.IsNullOrWhiteSpace(model.Email))
                seller.User.Email = model.Email;

            if (!string.IsNullOrWhiteSpace(model.PhoneNumber))
                seller.User.PhoneNumber = model.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(model.Password))
                seller.User.Password = model.Password;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Account updated successfully" });
        }

        // Fetch seller business details
        [HttpGet("business")]
        public async Task<IActionResult> GetSellerBusinessInfo([FromHeader] string sessionID)
        {
            
            if (string.IsNullOrWhiteSpace(sessionID))
                return BadRequest(new { message = "Session ID is required" });

            var seller = await _context.Sellers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.User.sessionID == sessionID);

            if (seller == null)
                return NotFound(new { message = "Seller not found" });

            return Ok(new
            {
                data = new
                {
                    SellerName = seller.SellerName,
                    address = seller.Address,
                    description = seller.Description
                }
            });
        }

        // Update seller business details
        [HttpPut("business")]
        public async Task<IActionResult> UpdateSellerBusinessInfo([FromHeader] string sessionID, [FromBody] UpdateBusinessModel model)
        {
            string jsonString = JsonSerializer.Serialize(model);
            _logger.LogInformation(jsonString);
            _logger.LogInformation(sessionID);
            if (string.IsNullOrWhiteSpace(sessionID))
                return BadRequest(new { message = "Session ID is required" });

            var seller = await _context.Sellers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.User.sessionID == sessionID);

            if (seller == null)
                return NotFound(new { message = "Seller not found" });

            _logger.LogInformation(model.SellerName);
            _logger.LogInformation(model.Address);
            _logger.LogInformation(model.Description);
            _logger.LogInformation(seller.ID);
            if (!string.IsNullOrWhiteSpace(model.SellerName))
                seller.SellerName = model.SellerName;

            if (!string.IsNullOrWhiteSpace(model.Address))
                seller.Address = model.Address;

            if (!string.IsNullOrWhiteSpace(model.Description))
                seller.Description = model.Description;

            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error when updating Seller with ID {SellerID}", seller.ID);
                return StatusCode(409, new { message = "Concurrency conflict. The data may have changed since it was loaded." });
            }


            return Ok(new { message = "Business information updated successfully" });
        }


        // New Endpoint: Fetch Seller Details by sellerID


        // GET: api/seller/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSellerById(string id)
        {
            // Fetch the seller based on the provided sellerID
            var seller = await _context.Sellers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.ID == id);

            if (seller == null)
            {
                return NotFound(new { message = "Seller not found" });
            }

            // Create an anonymous object to exclude sensitive fields
            var sellerData = new
            {
                ID = seller.ID,
                sellerName = seller.SellerName,
                description = seller.Description,
                address = seller.Address,
                phoneNumber = seller.User.PhoneNumber
            };

            return Ok(seller);
        }
    }

    // Models for incoming request payloads
    public class UpdateAccountModel
    {
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
    }

    public class UpdateBusinessModel
    {
        public string SellerName { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
    }
}
