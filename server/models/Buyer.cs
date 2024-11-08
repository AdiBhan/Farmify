// Buyer.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class Buyer
    {
        [Key]
        public int ID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        public string Status { get; set; } = string.Empty;

        // New fields for contact information
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public string PhoneNumber { get; set; } = string.Empty;

        [ForeignKey("UserID")]
        public virtual User User { get; set; } = null!;
    }
}