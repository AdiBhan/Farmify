using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using FarmifyService.models;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }
    }
}
