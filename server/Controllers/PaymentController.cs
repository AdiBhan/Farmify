using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using FarmifyService.models; 
using FarmifyService.Data;   

namespace FarmifyService.Controllers
{
    // Defines the route prefix for all actions in payment controller
    [Route("api/payment/")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly ApplicationDbContext _context;
        // Constructor to inject the database context
        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/payment/payment-failed
        // Returns an HTML page indicating payment failure
        [HttpGet("payment-failed")]
        public IActionResult PaymentFailed()
        {
            // Returns an HTML content with a custom payment failed message
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

        // GET: api/payment/payment-success
        // Returns an HTML page indicating payment success
        [HttpGet("payment-success")]
        public IActionResult PaymentSuccess()
        {
            // Returns an HTML content with a custom payment success message
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
        // Retrieves all credit cards associated with the user's session ID
        [HttpGet("cards")]
        public async Task<IActionResult> GetCreditCards([FromHeader] string sessionID)
        {
            // Validate the session ID
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            // Retrieve the user based on the session ID
            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Fetch all credit cards associated with the user
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

            // Return the list of credit cards
            return Ok(new { data = cards });
        }

        // POST: api/payment/cards
        // Adds a new credit card to the user's account
        [HttpPost("cards")]
        public async Task<IActionResult> AddCreditCard([FromHeader] string sessionID, [FromBody] CreditCardModel cardModel)
        {
            // Validate the session ID
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            // Retrieve the user based on the session ID
            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Create a new credit card entity
            var newCard = new CreditCard
            {
                UserID = user.ID,
                CardNumber = cardModel.CardNumber,
                ExpiryDate = cardModel.ExpiryDate,
                CVV = cardModel.CVV
            };

            // Add the new credit card to the database
            _context.CreditCards.Add(newCard);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Credit card added successfully" });
        }

        // PUT: api/payment/cards/{id}
        // Updates an existing credit card associated with the user
        [HttpPut("cards/{id}")]
        public async Task<IActionResult> UpdateCreditCard([FromHeader] string sessionID, [FromRoute] int id, [FromBody] CreditCardModel cardModel)
        {
            // Validate the session ID
            if (string.IsNullOrWhiteSpace(sessionID))
            {
                return BadRequest(new { message = "Session ID is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.sessionID == sessionID);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Find the existing credit card by ID and ensure it belongs to the user
            var existingCard = await _context.CreditCards.FirstOrDefaultAsync(c => c.ID == id && c.UserID == user.ID);

            if (existingCard == null)
            {
                return NotFound(new { message = "Credit card not found" });
            }

            // Update the credit card details
            existingCard.CardNumber = cardModel.CardNumber;
            existingCard.ExpiryDate = cardModel.ExpiryDate;
            existingCard.CVV = cardModel.CVV;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { message = "Credit card updated successfully" });
        }

        // DELETE: api/payment/cards/{id}
        // Deletes a credit card associated with the user
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

    // Model for credit card data received from the client
    public class CreditCardModel
    {
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
    }
}
