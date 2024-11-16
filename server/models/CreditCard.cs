using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace FarmifyService.models
{
public class CreditCard
{
    
    [Key] 
    public int ID { get; set; }

    [Required]
    public string CardNumber { get; set; }

    [Required]
    public string ExpiryDate { get; set; }

    [Required]
    public string CVV { get; set; }

    [Required]
    public string UserID { get; set; }

    [ForeignKey("UserID")]
    public User User { get; set; }
}
}