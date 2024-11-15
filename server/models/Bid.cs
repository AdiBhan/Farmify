using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class Bid
    {
        [Key]
        [Required]
        public required string ID { get; set; } 
        
        [ForeignKey("Buyer")]
        [Required]
        public required string BuyerID { get; set; } 
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public DateTime TimeStamp { get; set; }
        
        [ForeignKey("Product")]
        [Required]
        public long AuctionID { get; set; } 
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public bool DeliveryStatus { get; set; } 
        
        public int? Rating { get; set; }
        
        public required Buyer Buyer { get; set; } 
        public required Product Product { get; set; }
    }
}
