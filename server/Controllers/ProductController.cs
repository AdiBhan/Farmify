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
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest("Product is null.");
            }

            if (product.StartPrice <= 0 || product.EndPrice <= 0)
            {
                return BadRequest("Prices must be greater than zero.");
            }

            if (product.StartTime >= product.EndTime)
            {
                return BadRequest("End time must be after start time.");
            }

            try
            {
                // Set default values or adjust the product object if necessary
                product.ID = 0; // Let the database generate the ID
                product.StartTime = DateTime.SpecifyKind(product.StartTime, DateTimeKind.Unspecified);
                product.EndTime = DateTime.SpecifyKind(product.EndTime, DateTimeKind.Unspecified);

                // Save the product to the database
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductById), new { id = product.ID }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
                        SellerName = p.Seller.SellerName,
                        SellerDescription = p.Seller.Description
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
                        SellerName = p.Seller.SellerName,
                        SellerDescription = p.Seller.Description,
                        PPID = p.Seller.PPID,
                        PPsecret = p.Seller.PPsecret
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
