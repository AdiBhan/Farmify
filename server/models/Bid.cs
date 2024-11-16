using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace FarmifyService.models
{
    public class Bid
    {
        [Key]
        [Required]
        public string ID { get; set; } = Guid.NewGuid().ToString();
        
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

        [JsonIgnore]
        public Buyer? Buyer { get; set; } 
        [JsonIgnore]
        public Product? Product { get; set; }
    }
}
