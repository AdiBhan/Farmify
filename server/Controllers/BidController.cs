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

        // GET: api/bids
        [HttpGet]
        public async Task<IActionResult> GetAllBids()
        {
            try
            {
                var bids = await _context.Bids.ToListAsync();
                return Ok(bids);
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
                // Set the timestamp to the current UTC time
                bid.TimeStamp = DateTime.UtcNow;

                // Add the bid to the database
                _context.Bids.Add(bid);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBidById), new { id = bid.ID }, bid);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/bids/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBidById(int id)
        {
            try
            {
                var bid = await _context.Bids.FindAsync(id);
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
    }
}
