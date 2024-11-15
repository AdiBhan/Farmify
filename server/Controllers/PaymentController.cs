using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using FarmifyService.models; 
using FarmifyService.Data;   

namespace FarmifyService.Controllers
{
    [Route("api/payment/")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/payment/cards
        [HttpGet("cards")]
        public async Task<IActionResult> GetCreditCards([FromHeader] string sessionID)
        {
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var cards = await _context.CreditCards
                .Where(c => c.UserID == user.ID)
                .Select(c => new
                {
                    id = c.ID,
                    cardNumber = c.CardNumber,
                    expiryDate = c.ExpiryDate,
                    cvv = c.CVV // Optional: mask CVV for security
                })
                .ToListAsync();

            return Ok(new { data = cards });
        }

        // POST: api/payment/cards
        [HttpPost("cards")]
        public async Task<IActionResult> AddCreditCard([FromHeader] string sessionID, [FromBody] CreditCardModel cardModel)
        {
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var newCard = new CreditCard
            {
                UserID = user.ID,
                CardNumber = cardModel.CardNumber,
                ExpiryDate = cardModel.ExpiryDate,
                CVV = cardModel.CVV
            };

            _context.CreditCards.Add(newCard);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Credit card added successfully" });
        }

        // PUT: api/payment/cards/{id}
        [HttpPut("cards/{id}")]
        public async Task<IActionResult> UpdateCreditCard([FromHeader] string sessionID, [FromRoute] int id, [FromBody] CreditCardModel cardModel)
        {
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var existingCard = await _context.CreditCards.FirstOrDefaultAsync(c => c.ID == id && c.UserID == user.ID);

            if (existingCard == null)
            {
                return NotFound(new { message = "Credit card not found" });
            }

            existingCard.CardNumber = cardModel.CardNumber;
            existingCard.ExpiryDate = cardModel.ExpiryDate;
            existingCard.CVV = cardModel.CVV;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Credit card updated successfully" });
        }

        // DELETE: api/payment/cards/{id}
        [HttpDelete("cards/{id}")]
        public async Task<IActionResult> DeleteCreditCard([FromHeader] string sessionID, [FromRoute] int id)
        {
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var existingCard = await _context.CreditCards.FirstOrDefaultAsync(c => c.ID == id && c.UserID == user.ID);

            if (existingCard == null)
            {
                return NotFound(new { message = "Credit card not found" });
            }

            _context.CreditCards.Remove(existingCard);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Credit card deleted successfully" });
        }
    }

    public class CreditCardModel
    {
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
    }
}
