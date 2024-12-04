using Microsoft.AspNetCore.Mvc;
using System;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/delivery")]
    public class DoorDashController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<DoorDashController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        // DoorDash API Credentials
        private readonly string DeveloperId = "7714fb92-b125-44de-a0da-a5b7529e93a8";
        private readonly string KeyId = "758af6e3-049b-404a-8447-bc14a90c9c7a";
        private readonly string SigningSecret = "Wj2nZ_qTdTYW2R4KhjJ5FkuhU2Ggg6CBfHNW6cZ5ZHc";

        public DoorDashController(IConfiguration configuration, ILogger<DoorDashController> logger, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClientFactory = httpClientFactory;

            // Load DoorDash API credentials from configuration or environment variables
            DeveloperId = "7714fb92-b125-44de-a0da-a5b7529e93a8";
            KeyId = "758af6e3-049b-404a-8447-bc14a90c9c7a";
            SigningSecret = "Wj2nZ_qTdTYW2R4KhjJ5FkuhU2Ggg6CBfHNW6cZ5ZHc";
        }

        // POST: /api/delivery/doordash
        [HttpPost("doordash")]
        public async Task<IActionResult> CreateDoorDashDelivery([FromBody] DeliveryRequest deliveryRequest)
        {
            try
            {
                if (deliveryRequest == null)
                {
                    _logger.LogWarning("Invalid delivery request data received.");
                    return BadRequest("Invalid delivery request data.");
                }

                // Generate JWT token
                string token = GenerateJwt();

                // Create the JSON payload for the DoorDash API request
                var jsonContent = JsonSerializer.Serialize(new
                {
                    external_delivery_id = deliveryRequest.ExternalDeliveryId,
                    pickup_address = deliveryRequest.PickupAddress,
                    pickup_business_name = deliveryRequest.PickupBusinessName,
                    pickup_phone_number = deliveryRequest.PickupPhoneNumber,
                    pickup_instructions = deliveryRequest.PickupInstructions,
                    dropoff_address = deliveryRequest.DropoffAddress,
                    dropoff_business_name = deliveryRequest.DropoffBusinessName,
                    dropoff_phone_number = deliveryRequest.DropoffPhoneNumber,
                    dropoff_instructions = deliveryRequest.DropoffInstructions
                });

                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                using HttpClient client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                // Send the POST request to DoorDash API
                var result = await client.PostAsync("https://openapi.doordash.com/drive/v2/deliveries", content);

                // Get the response content
                var resultString = await result.Content.ReadAsStringAsync();

                if (!result.IsSuccessStatusCode)
                {
                    _logger.LogError($"DoorDash API Error: {result.StatusCode}, {resultString}");
                    return StatusCode((int)result.StatusCode, resultString);
                }

                // Deserialize the response if needed
                var deliveryResponse = JsonSerializer.Deserialize<DeliveryResponse>(resultString);

                // Return the successful response to the frontend
                return Ok(deliveryResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error creating DoorDash delivery: {Exception}", ex);
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        // GET: /api/delivery/status/{deliveryId}
        [HttpGet("status/{deliveryId}")]
        public async Task<IActionResult> GetDeliveryStatus(string deliveryId)
        {
            try
            {
                using HttpClient client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", GenerateJwt());

                // Make the request to DoorDash API
                var result = await client.GetAsync($"https://openapi.doordash.com/drive/v2/deliveries/{deliveryId}");

                // Read status code and response content
                var status = result.StatusCode;
                var resultString = await result.Content.ReadAsStringAsync();

                if (!result.IsSuccessStatusCode)
                {
                    _logger.LogError($"DoorDash API Error: {result.StatusCode}, {resultString}");
                    return StatusCode((int)status, resultString);
                }

                // Return the response to the client
                return Ok(resultString);
            }
            catch (Exception ex)
            {
                // Log the exception and return a 500 response
                _logger.LogError("An error occurred while fetching the delivery status: {0}", ex.Message);
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        // Method to generate a JWT token
        private string GenerateJwt()
        {
            // Decode the DoorDash signing secret from Base64 URL format to a byte array
            var decodedSecret = Base64UrlEncoder.DecodeBytes(SigningSecret);

            // Create a security key using the decoded secret
            var securityKey = new SymmetricSecurityKey(decodedSecret);

            // Set up signing credentials with the security key and specify HMAC-SHA256 as the algorithm
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create a JWT header that includes the signing credentials
            var header = new JwtHeader(credentials);
            header["dd-ver"] = "DD-JWT-V1";

            // Create a JWT payload with necessary claims
            var payload = new JwtPayload(
                issuer: DeveloperId,
                audience: "doordash",
                claims: new List<Claim> { new Claim("kid", KeyId) },
                notBefore: null,
                expires: DateTime.UtcNow.AddSeconds(300),
                issuedAt: DateTime.UtcNow
            );

            // Create the JWT by combining the header and payload
            var securityToken = new JwtSecurityToken(header, payload);

            // Serialize the JWT into a compact format
            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

            // Return the generated token string
            return token;
        }
    }

    // Model for the delivery request
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

    // Model for the delivery response (adjust fields based on DoorDash API response)
    public class DeliveryResponse
    {
        public string ExternalDeliveryId { get; set; }
        public string DeliveryId { get; set; }
        public string Status { get; set; }
    }
}
