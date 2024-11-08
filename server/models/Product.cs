using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class Product
    {
        [Key]
        public string ID { get; set; } // Matches character(36) type
        public string Name { get; set; } // Matches character varying(255)
        public string Description { get; set; } // Matches character varying(255)
        public string Category { get; set; } // Matches character varying(255)
        
        [ForeignKey("Seller")]
        public string SellerID { get; set; } // Matches character(36) and serves as the foreign key

        public int Quantity { get; set; } // Matches integer type
        public decimal Price { get; set; } // Matches numeric(8, 2)
        public string Status { get; set; } // Matches character varying(255)
        public DateTime? ExpirationDate { get; set; } // Matches nullable date

        // Navigation property to Seller
        public Seller Seller { get; set; }
    }
}
