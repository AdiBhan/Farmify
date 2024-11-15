using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FarmifyService.models
{
    public class Bid
    {
        public int ID { get; set; }
        public int BuyerID { get; set; }
        public decimal Amount { get; set; }
        public DateTime TimeStamp { get; set; }
        public int AuctionID { get; set; }



        [Required]
        public Buyer buyer { get; set; }

        
        [Required]
        public Auction auction { get; set; }
    }
}