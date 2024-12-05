// File: Models/DeliveryRequest.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmifyService.models
{
    public class DeliveryRequest
    {
        public string ExternalDeliveryId { get; set; }
        public string PickupAddress { get; set; }
        public string PickupBusinessName { get; set; }
        public string PickupPhoneNumber { get; set; }
        public string PickupInstructions { get; set; }
        public string DropoffAddress { get; set; }
        public string DropoffBusinessName { get; set; }
        public string DropoffPhoneNumber { get; set; }
        public string DropoffInstructions { get; set; }
    }
}
