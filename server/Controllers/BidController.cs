using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using FarmifyService.models;
using System;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    // Define API route for bids and specify this controller handles bid-related logic
    [Route("api/bids")]
    [ApiController]
    public class BidsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor to inject the application's database context
        public BidsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bids
        // Fetch all bids with associated buyer and product information
        [HttpGet]
    public async Task<IActionResult> GetAllBids()
    {
        try
        {
            var bids = await _context.Bids
                .Include(b => b.Buyer) // Ensure Buyer is included
                .Include(b => b.Product)
                    .ThenInclude(p => p.Seller) // Ensure Seller is included through Product
                .Select(b => new
                {
                    b.ID,
                    b.Amount,
                    b.TimeStamp,
                    b.AuctionID,
                    b.Price,
                    b.DeliveryStatus,
                    b.Rating,
                    Buyer = new
                    {
                        b.BuyerID,
                        Email = b.Buyer.User.Email 
                    },
                    Product = new
                    {
                        b.Product.ID,
                        b.Product.Name,
                        b.Product.Description,
                        b.Product.ImgUrl,
                        b.Product.StartPrice,
                        b.Product.EndPrice,
                        SellerName = b.Product.Seller.SellerName, // Include seller's name
                        SellerDescription = b.Product.Seller.Description // Include seller's description
                    }
                })
                .ToListAsync();

            return Ok(bids); // Return bids as HTTP 200 with JSON response
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

        // GET: api/bids/{id}
        // Fetch a specific bid by its ID with associated buyer and product information
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBidById(string id)
        {
            try
            {
                var bid = await _context.Bids
                    .Include(b => b.Buyer) // Load Buyer navigation property
                    .Include(b => b.Product)
                        .ThenInclude(p => p.Seller) // Load Seller navigation property through Product
                    .Where(b => b.ID == id)
                    .Select(b => new
                    {
                        b.ID,
                        b.Amount,
                        b.TimeStamp,
                        b.AuctionID,
                        b.Price,
                        b.DeliveryStatus,
                        b.Rating,
                        Buyer = new
                        {
                            b.BuyerID,
                            Email = b.Buyer.User.Email 
                        },
                        Product = new
                        {
                            b.Product.ID,
                            b.Product.Name,
                            b.Product.Description,
                            b.Product.StartPrice,
                            b.Product.EndPrice,
                            SellerName = b.Product.Seller.SellerName, // Fetch SellerName explicitly
                            SellerDescription = b.Product.Seller.Description
                        }
                    })
                    .FirstOrDefaultAsync();

                if (bid == null)
                {
                    return NotFound("Bid not found."); // Return 404 if bid doesn't exist
                }

                return Ok(bid); // Return bid as HTTP 200 with JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/bids/{id}
        // Update the rating for a specific bid
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBidRating(string id, [FromBody] UpdateRatingDto updatedRating)
        {
            if (string.IsNullOrEmpty(id) || updatedRating == null)
            {
                return BadRequest("Invalid input."); // Return 400 for invalid input
            }

            try
            {
                var bid = await _context.Bids.FindAsync(id); // Find bid by ID
                if (bid == null)
                {
                    return NotFound("Bid not found."); // Return 404 if bid doesn't exist
                }

                bid.Rating = updatedRating.Rating; // Update only the rating
                _context.Bids.Update(bid); // Mark the entity as modified
                await _context.SaveChangesAsync(); // Save changes to the database

                return NoContent(); // Success
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/bids
        // Create a new bid
        [HttpPost]
        public async Task<IActionResult> CreateBid([FromBody] Bid bid)
        {
            if (bid == null)
            {
                return BadRequest("Bid is null."); // Return 400 if input is null
            }

            if (bid.Amount <= 0)
            {
                return BadRequest("Amount must be greater than zero."); // Validate bid amount
            }

            try
            {
                bid.TimeStamp = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified); // Set timestamp to current UTC


                _context.Bids.Add(bid); // Add bid to the database
                await _context.SaveChangesAsync();  // Save changes to the database

                return CreatedAtAction(nameof(GetBidById), new { id = bid.ID }, bid); // Return 201 with location of created resource
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }


    // Data Transfer Object (DTO) for updating bid rating
    public class UpdateRatingDto
    {
        public int Rating { get; set; }
    }
}
