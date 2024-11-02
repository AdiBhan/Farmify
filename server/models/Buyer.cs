using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.models
{
    public class Buyer
    {
        public int Id { get; set; }
        // Foreign key to User table
        public int UserID { get; set; } 
        public string Address { get; set; }
        public string Status { get; set; }


        // Navigation property back to User
        public User User { get; set; }

    }
}