using System.ComponentModel.DataAnnotations;

namespace FarmifyService.models
{
    public class Auction
    {
        public int ID { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public decimal StartingPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public DateTime EndTime { get; set; }
        
        [Required]
        public virtual Product product { get; set; } = null!;
    }
}