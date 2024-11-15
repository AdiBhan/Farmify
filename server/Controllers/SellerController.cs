using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using FarmifyService.Data; 
using FarmifyService.Models; 

namespace FarmifyService.Controllers
{
    [Route("api/seller/")]
    [ApiController]
    public class SellerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SellerController(ApplicationDbContext context)
        {
            _context = context;
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
                    phoneNumber = seller.User.PhoneNumber
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
                    name = seller.Name,
                    address = seller.Address,
                    description = seller.Description
                }
            });
        }

        // Update seller business details
        [HttpPut("business")]
        public async Task<IActionResult> UpdateSellerBusinessInfo([FromHeader] string sessionID, [FromBody] UpdateBusinessModel model)
        {
            if (string.IsNullOrWhiteSpace(sessionID))
                return BadRequest(new { message = "Session ID is required" });

            var seller = await _context.Sellers
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.User.sessionID == sessionID);

            if (seller == null)
                return NotFound(new { message = "Seller not found" });

            if (!string.IsNullOrWhiteSpace(model.Name))
                seller.Name = model.Name;

            if (!string.IsNullOrWhiteSpace(model.Address))
                seller.Address = model.Address;

            if (!string.IsNullOrWhiteSpace(model.Description))
                seller.Description = model.Description;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Business information updated successfully" });
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
        public string Name { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
    }
}

