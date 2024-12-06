using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using FarmifyService.Data;
using FarmifyService.models;
using System.Diagnostics;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    // Defines API routes for product-related operations
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        // Constructor to inject the database context and logger
        public ProductsController(ApplicationDbContext context, ILogger<ProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/products
        // Adds a new product to the database
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            // Validate input product data
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

                // Add the product to the database
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Return a 201 Created response with the location of the new product
                return CreatedAtAction(nameof(GetProductById), new { id = product.ID }, product);
            }
            catch (Exception ex)
            {
                // Log and return a 500 Internal Server Error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/products
        // Fetches all products from the database
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var stopwatch = Stopwatch.StartNew(); // Track execution time
            _logger.LogInformation("Start: Fetching all products");

            try
            {
                var queryStart = Stopwatch.StartNew();

                // Fetch all products with related seller information
                var products = await _context.Products
                    .AsNoTracking() // Disable EF tracking for performance
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
                        p.GalleryUrls,
                        SellerName = p.Seller.SellerName,
                        SellerAddress = p.Seller.Address,
                        SellerDescription = p.Seller.Description
                    })
                    .ToListAsync();

                queryStart.Stop();
                _logger.LogInformation($"Query executed in {queryStart.ElapsedMilliseconds} ms");

                stopwatch.Stop();
                _logger.LogInformation($"End: Fetched all products in {stopwatch.ElapsedMilliseconds} ms");

                // Return products as an HTTP 200 OK response
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Log and return a 500 Internal Server Error
                _logger.LogError($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/products/{id}
        // Fetches a specific product by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(long id)
        {
            var stopwatch = Stopwatch.StartNew(); // Track execution time
            _logger.LogInformation($"Start: Fetching product with ID {id}");

            try
            {
                var queryStart = Stopwatch.StartNew();

                // Fetch the product by ID with related seller information
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
                        p.GalleryUrls,
                        SellerName = p.Seller.SellerName,
                        SellerDescription = p.Seller.Description,
                        SellerAddress = p.Seller.Address,
                        PPID = p.Seller.PPID, // PayPal ID
                        PPsecret = p.Seller.PPsecret // PayPal Secret
                    })
                    .FirstOrDefaultAsync();

                queryStart.Stop();
                _logger.LogInformation($"Query executed in {queryStart.ElapsedMilliseconds} ms");

                if (product == null)
                {
                    // Log and return a 404 Not Found if the product doesn't exist
                    _logger.LogWarning($"Product with ID {id} not found.");
                    stopwatch.Stop();
                    return NotFound("Product not found.");
                }

                stopwatch.Stop();
                _logger.LogInformation($"End: Fetched product with ID {id} in {stopwatch.ElapsedMilliseconds} ms");

                // Return product as an HTTP 200 OK response
                return Ok(product);
            }
            catch (Exception ex)
            {
                // Log and return a 500 Internal Server Error
                _logger.LogError($"Error fetching product with ID {id}: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
