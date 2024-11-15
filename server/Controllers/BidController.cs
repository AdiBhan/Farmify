using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using FarmifyService.models;
using System;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    [Route("api/bids")]
    [ApiController]
    public class BidsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BidsController(ApplicationDbContext context)
        {
            _context = context;
        }

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
                        Email = b.Buyer.User.Email // Assuming User.Email is accessible
                    },
                    Product = new
                    {
                        b.Product.ID,
                        b.Product.Name,
                        b.Product.Description,
                        b.Product.StartPrice,
                        b.Product.EndPrice,
                        SellerName = b.Product.Seller.SellerName // Fetch SellerName explicitly
                    }
                })
                .ToListAsync();

            return Ok(bids);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


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
                            Email = b.Buyer.User.Email // Assuming Buyer.User.Email exists
                        },
                        Product = new
                        {
                            b.Product.ID,
                            b.Product.Name,
                            b.Product.Description,
                            b.Product.StartPrice,
                            b.Product.EndPrice,
                            SellerName = b.Product.Seller.SellerName // Fetch SellerName explicitly
                        }
                    })
                    .FirstOrDefaultAsync();

                if (bid == null)
                {
                    return NotFound("Bid not found.");
                }

                return Ok(bid);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // POST: api/bids
        [HttpPost]
        public async Task<IActionResult> CreateBid([FromBody] Bid bid)
        {
            if (bid == null)
            {
                return BadRequest("Bid is null.");
            }

            if (bid.Amount <= 0)
            {
                return BadRequest("Amount must be greater than zero.");
            }

            try
            {
                bid.TimeStamp = DateTime.UtcNow;

                _context.Bids.Add(bid);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBidById), new { id = bid.ID }, bid);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
