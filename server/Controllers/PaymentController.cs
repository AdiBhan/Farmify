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

        [HttpGet("payment-failed")]
        public IActionResult PaymentFailed()
        {
            return Content(@"
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Payment Failed</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: red;
                            color: white;
                            font-family: Arial, sans-serif;
                        }
                        .message-container {
                            text-align: center;
                            padding: 20px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 10px;
                        }
                        .message-container h1 {
                            margin: 0;
                            font-size: 2rem;
                        }
                        .message-container p {
                            margin-top: 10px;
                            font-size: 1rem;
                        }
                    </style>
                </head>
                <body>
                    <div class='message-container'>
                        <h1>Payment Failed</h1>
                        <p>Something went wrong. Please try again or contact support.</p>
                    </div>
                </body>
                </html>
            ", "text/html");
        }


        [HttpGet("payment-success")]
        public IActionResult PaymentSuccess()
        {
            return Content(@"
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Payment Success</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: green;
                            color: white;
                            font-family: Arial, sans-serif;
                        }
                        .message-container {
                            text-align: center;
                            padding: 20px;
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 10px;
                        }
                        .message-container h1 {
                            margin: 0;
                            font-size: 2rem;
                        }
                        .message-container p {
                            margin-top: 10px;
                            font-size: 1rem;
                        }
                    </style>
                </head>
                <body>
                    <div class='message-container'>
                        <h1>Payment Successful!</h1>
                        <p>Now close this window to return to the main website.</p>
                    </div>
                </body>
                </html>
            ", "text/html");
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
                    cvv = c.CVV
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
