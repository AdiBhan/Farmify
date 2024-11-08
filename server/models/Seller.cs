// Seller.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class Seller
    {
        [Key]
        public string ID { get; set; }
        
        [Required]
        public string UserID { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        public string Status { get; set; } = string.Empty;

        [ForeignKey("UserID")]
        public virtual User User { get; set; } = null!;
    }
}