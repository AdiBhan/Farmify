using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class User
    {
        [Key]
        [Required]
        public string ID { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        public string? sessionID { get; set; }
        
        [Required]
        public int Credits { get; set; } 

        public string? AccountType { get; set; }

        [Required]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow; 

        
        public string? PhoneNumber { get; set; } = string.Empty;

        public string? ProfileImgUrl { get; set; } 

        // Navigation properties
        public virtual Buyer? Buyer { get; set; }
        public virtual Seller? Seller { get; set; }
    }
}