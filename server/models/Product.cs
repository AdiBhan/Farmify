using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int SellerID { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool Status { get; set; }

        // Navigation to sellerID
        public Seller seller { get; set; }

    }
}