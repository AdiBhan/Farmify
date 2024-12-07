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

                // Highest sale price
                var highestSalePrice = allBids.Any()
                    ? allBids.Max(b => (decimal)b.Amount * b.Price)
                    : 0;

                // Most popular category
                var mostPopularCategory = await _context.Products
                    .GroupBy(p => p.Category)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new { Category = g.Key, Count = g.Count() })
                    .FirstOrDefaultAsync();

                // Total revenue
                var totalRevenue = allBids.Any()
                    ? allBids.Sum(b => (decimal)b.Amount * b.Price)
                    : 0;

                // Average time to sale
                var averageTimeToSale = await _context.Products
                    .Where(p => p.EndTime <= nowWithoutKind)
                    .Select(p => (p.EndTime - p.StartTime).TotalMinutes)
                    .AverageAsync();

                // Buyer with most bids
                var topBuyer = await _context.Bids
                    .GroupBy(b => b.BuyerID)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new { BuyerID = g.Key, BidCount = g.Count() })
                    .FirstOrDefaultAsync();

                // Highest-rated seller
                var highestRatedSeller = await _context.Sellers
                    .Where(s => s.SellerRating.HasValue)
                    .OrderByDescending(s => s.SellerRating)
                    .Select(s => new { s.SellerName, s.SellerRating })
                    .FirstOrDefaultAsync();

                // Listings without bids
                var listingsWithoutBids = await _context.Products
                    .Where(p => !_context.Bids.Any(b => b.AuctionID == p.ID))
                    .CountAsync();

                // Average number of bids per listing
                var averageBidsPerListing = totalListings > 0
                    ? (double)totalBids / totalListings
                    : 0;

                // Most expensive active listing
                var mostExpensiveActiveListing = await _context.Products
                    .Where(p => p.EndTime > nowWithoutKind)
                    .OrderByDescending(p => p.StartPrice)
                    .Select(p => new { p.Name, p.StartPrice })
                    .FirstOrDefaultAsync();

                // Most frequent bid time
                var mostFrequentBidHour = await _context.Bids
                    .GroupBy(b => b.TimeStamp.Hour)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new { Hour = g.Key, Count = g.Count() })
                    .FirstOrDefaultAsync();

                // Top-selling product
                var topSellingProduct = await _context.Bids
                    .GroupBy(b => b.AuctionID)
                    .OrderByDescending(g => g.Sum(b => b.Amount))
                    .Select(g => new { ProductID = g.Key, TotalSold = g.Sum(b => b.Amount) })
                    .FirstOrDefaultAsync();

                // Constructing the response
                var stats = new
                {
                    TotalBids = totalBids,
                    AverageSalePrice = averageSalePrice,
                    AverageRating = averageRating,
                    MostActiveSeller = sellerInfo ?? new { SellerName = "N/A", Description = "No active seller found" },
                    TotalListings = totalListings,
                    ActiveListings = activeListings,
                    HighestSalePrice = highestSalePrice,
                    MostPopularCategory = mostPopularCategory?.Category ?? "N/A",
                    TotalRevenue = totalRevenue,
                    AverageTimeToSale = averageTimeToSale,
                    BuyerWithMostBids = topBuyer ?? new { BuyerID = "N/A", BidCount = 0 },
                    HighestRatedSeller = highestRatedSeller ?? new { SellerName = "N/A", SellerRating = (decimal?)0 },
                    ListingsWithoutBids = listingsWithoutBids,
                    AverageBidsPerListing = averageBidsPerListing,
                    MostExpensiveActiveListing = mostExpensiveActiveListing ?? new { Name = "N/A", StartPrice = 0m },
                    MostFrequentBidHour = mostFrequentBidHour?.Hour ?? -1,
                    TopSellingProduct = topSellingProduct ?? new { ProductID = 0L, TotalSold = 0 }
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
