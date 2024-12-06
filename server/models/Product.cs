using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FarmifyService.models
{
    public class Product
    {
        [Key]
        public long ID { get; set; } // Matches bigint

        [Required]
        public required string Name { get; set; } // Matches character varying(255)

        [Required]
        public required string Description { get; set; } // Matches character varying(255)

        public string? Category { get; set; } // Matches character varying(255)

        [Required]
        [ForeignKey("Seller")]
        public required string SellerID { get; set; } // Matches character(36)

        [Required]
        public int Quantity { get; set; } // Matches integer

        [Required]
        public decimal StartPrice { get; set; } // Matches numeric(8, 2)

        [Required]
        public decimal EndPrice { get; set; } // Matches numeric(8, 2)

        [Required]
        public DateTime StartTime { get; set; } // Matches timestamp without time zone

        [Required]
        public DateTime EndTime { get; set; } // Matches timestamp without time zone

        public string? ImgUrl { get; set; } // Matches character varying(255)

        // New property for storing gallery URLs as JSON (array of strings).
        // Ensure the column in Supabase is created as: GalleryUrls json NULL
        [Column(TypeName = "json")]
        public string[]? GalleryUrls { get; set; }

        // Navigation property
        [JsonIgnore]
        public Seller? Seller { get; set; }
    }
}
