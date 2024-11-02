using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.models
{
    public class Auction
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal StartPrice { get; set; }
        public decimal EndPrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ProductId { get; set; }

        public Product product { get; set; }
        
    }
}