using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.models
{
    public class Bid
    {
        public int ID { get; set; }
        public int BuyerID { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int AuctionID { get; set; }

        public Buyer buyer { get; set; }
        public Auction auction { get; set; }
    }
}