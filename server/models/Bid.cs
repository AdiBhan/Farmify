using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class Bid
    {
        [Key]
        public string ID { get; set; } // Matches character(36)
        [Required]
        [ForeignKey("Buyer")]
        public string BuyerID { get; set; } // Matches character(36)
        [Required]
        public decimal Amount { get; set; } // Matches numeric(8, 2)
        [Required]
        public DateTime TimeStamp { get; set; } // Matches timestamp without time zone
        [Required]
        [ForeignKey("Product")]
        public long AuctionID { get; set; } // Matches bigint
        [Required]
        public decimal Price { get; set; } // Matches numeric
        [Required]
        public bool DeliveryStatus { get; set; } // Matches boolean
        public int? Rating { get; set; } // Matches nullable integer

        // Navigation properties
        public Buyer Buyer { get; set; }
        public Product Product { get; set; }
    }
}
