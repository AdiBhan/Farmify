using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.models
{
    public class Buyer
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
    }
}