using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.models
{
    public class User
    {
        public int ID { get; set; }
        public string Email { get; set; }
        public string Username { get; set;}
        public string Password { get; set; }
        public string sessionID { get; set; }
        public string credits { get; set; }


        // Navigation property back to User
        public Buyer Buyer { get; set; }
        public Seller Seller { get; set; }

    }
}