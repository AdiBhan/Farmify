using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using FarmifyService.Data;
using FarmifyService.models;
using System.Diagnostics;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ApplicationDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation("Start: Fetching all products");

            try
            {
                var queryStart = Stopwatch.StartNew();
                var products = await _context.Products
                    .AsNoTracking()
                    .Include(p => p.Seller)
                    .Select(p => new
                    {
                        p.ID,
                        p.Name,
                        p.Description,
                        p.Category,
                        p.Quantity,
                        p.StartPrice,
                        p.EndPrice,
                        p.StartTime,
                        p.EndTime,
                        p.ImgUrl,
                        SellerName = p.Seller.SellerName
                    }).ToListAsync();
                queryStart.Stop();

                _logger.LogInformation($"Query executed in {queryStart.ElapsedMilliseconds} ms");

                stopwatch.Stop();
                _logger.LogInformation($"End: Fetched all products in {stopwatch.ElapsedMilliseconds} ms");

                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/products/{id}
        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(long id)
        {
            var stopwatch = Stopwatch.StartNew();
            _logger.LogInformation($"Start: Fetching product with ID {id}");

            try
            {
                var queryStart = Stopwatch.StartNew();
                var product = await _context.Products
                    .Include(p => p.Seller)
                    .Where(p => p.ID == id)
                    .Select(p => new
                    {
                        p.ID,
                        p.Name,
                        p.Description,
                        p.Category,
                        p.Quantity,
                        p.StartPrice,
                        p.EndPrice,
                        p.StartTime,
                        p.EndTime,
                        p.ImgUrl,
                        SellerName = p.Seller.SellerName
                    })
                    .FirstOrDefaultAsync();
                queryStart.Stop();

                _logger.LogInformation($"Query executed in {queryStart.ElapsedMilliseconds} ms");

                if (product == null)
                {
                    _logger.LogWarning($"Product with ID {id} not found.");
                    stopwatch.Stop();
                    return NotFound("Product not found.");
                }

                stopwatch.Stop();
                _logger.LogInformation($"End: Fetched product with ID {id} in {stopwatch.ElapsedMilliseconds} ms");

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching product with ID {id}: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
