using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    [Route("api/stats")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/stats
        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                // Total number of bids
                var totalBids = await _context.Bids.CountAsync();

                // Average sale price (Amount * Price per bid, calculated in memory)
                var allBids = await _context.Bids
                    .Select(b => new { b.Amount, b.Price })
                    .ToListAsync();
                var averageSalePrice = allBids.Any()
                    ? allBids.Average(b => (decimal)b.Amount * b.Price)
                    : 0;

                // Average rating
                var allRatings = await _context.Bids
                    .Where(b => b.Rating.HasValue)
                    .Select(b => b.Rating.Value)
                    .ToListAsync();
                var averageRating = allRatings.Any()
                    ? allRatings.Average()
                    : 0;

                // Most active seller (by number of products sold in auctions)
                var mostActiveSeller = await _context.Products
                    .GroupBy(p => p.SellerID)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new
                    {
                        SellerID = g.Key,
                        ProductCount = g.Count()
                    })
                    .FirstOrDefaultAsync();

                var sellerInfo = mostActiveSeller != null
                    ? await _context.Sellers
                        .Where(s => s.ID == mostActiveSeller.SellerID)
                        .Select(s => new
                        {
                            s.SellerName,
                            s.Description
                        })
                        .FirstOrDefaultAsync()
                    : null;

                // Total number of listings
                var totalListings = await _context.Products.CountAsync();

                // Total active listings (where EndTime is after the current time)
                var utcNow = DateTime.UtcNow;
                var nowWithoutKind = DateTime.SpecifyKind(utcNow, DateTimeKind.Unspecified);
                var activeListings = await _context.Products
                    .CountAsync(p => p.EndTime > nowWithoutKind);

                // Constructing the response
                var stats = new
                {
                    TotalBids = totalBids,
                    AverageSalePrice = averageSalePrice,
                    AverageRating = averageRating,
                    MostActiveSeller = sellerInfo ?? new { SellerName = "N/A", Description = "No active seller found" },
                    TotalListings = totalListings,
                    ActiveListings = activeListings
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
