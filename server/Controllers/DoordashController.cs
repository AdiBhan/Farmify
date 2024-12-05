using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[Route("api/deliveries")] // Defines the base route for delivery-related actions
[ApiController] // Indicates that this class is an API controller
public class DoorDashController : ControllerBase
{
    // DoorDash-specific credentials for authentication
    private readonly string _developerId = "7714fb92-b125-44de-a0da-a5b7529e93a8";
    private readonly string _keyId = "758af6e3-049b-404a-8447-bc14a90c9c7a";
    private readonly string _signingSecret = "Wj2nZ_qTdTYW2R4KhjJ5FkuhU2Ggg6CBfHNW6cZ5ZHc";

    // Generates a JWT (JSON Web Token) for authenticating with the DoorDash API
    private string GenerateJwt()
    {
        // Decode the secret key
        var decodedSecret = Base64UrlEncoder.DecodeBytes(_signingSecret);
        var securityKey = new SymmetricSecurityKey(decodedSecret);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Create JWT header with custom DoorDash version
        var header = new JwtHeader(credentials);
        header["dd-ver"] = "DD-JWT-V1";

        // Create JWT payload with issuer, audience, claims, and expiration
        var payload = new JwtPayload(
            issuer: _developerId,
            audience: "doordash",
            claims: new List<Claim> { new Claim("kid", _keyId) },
            notBefore: null,
            expires: DateTime.UtcNow.AddSeconds(300), // Token expires in 5 minutes
            issuedAt: DateTime.UtcNow);

        // Generate and return the token as a string
        var securityToken = new JwtSecurityToken(header, payload);
        return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }

    // POST: api/deliveries/generate
    // Creates a delivery order using the DoorDash API
    [HttpPost("generate")]
    public async Task<IActionResult> GenerateDeliveryOrder([FromBody] DeliveryRequest request)
    {
        try
        {
            // Generate a JWT for authentication
            string jwtToken = GenerateJwt();

            // Log order details (for debugging purposes)
            Console.WriteLine($"OrderValue: {request.OrderValue}");
            Console.WriteLine($"Tip: {request.Tip}");

            // Serialize the request payload to JSON
            var jsonContent = JsonSerializer.Serialize(new
            {
                external_delivery_id = request.ExternalDeliveryId,
                pickup_address = request.PickupAddress,
                pickup_business_name = request.PickupBusinessName,
                pickup_phone_number = request.PickupPhoneNumber,
                pickup_instructions = request.PickupInstructions,
                pickup_reference_tag = request.PickupReferenceTag,
                dropoff_address = request.DropoffAddress,
                dropoff_business_name = request.DropoffBusinessName,
                dropoff_phone_number = request.DropoffPhoneNumber,
                dropoff_instructions = request.DropoffInstructions,
                order_value = request.OrderValue,
                tip = request.Tip
            });

            // Prepare the HTTP request content
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Send the request to the DoorDash API
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);
            var response = await client.PostAsync("https://openapi.doordash.com/drive/v2/deliveries", content);

            // Read the response body
            var responseBody = await response.Content.ReadAsStringAsync();

            // Check if the request was successful
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, responseBody); // Return API error response
            }

            return Ok(responseBody); // Return success response
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}"); // Return HTTP 500 on error
        }
    }

    // GET: api/deliveries/track/{deliveryId}
    // Tracks the status of a delivery order by its ID using the DoorDash API
    [HttpGet("track/{deliveryId}")]
    public async Task<IActionResult> TrackOrder(string deliveryId)
    {
        try
        {
            // Generate a JWT for authentication
            string jwtToken = GenerateJwt();

            // Send the request to the DoorDash API
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);
            var response = await client.GetAsync($"https://openapi.doordash.com/drive/v2/deliveries/{deliveryId}");

            // Read the response body
            var responseBody = await response.Content.ReadAsStringAsync();

            // Check if the request was successful
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, responseBody); // Return API error response
            }

            return Ok(responseBody); // Return success response
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}"); // Return HTTP 500 on error
        }
    }
}

// Represents the structure of a delivery order request
public class DeliveryRequest
{
    public string ExternalDeliveryId { get; set; }
    public string PickupAddress { get; set; }
    public string PickupBusinessName { get; set; } 
    public string PickupPhoneNumber { get; set; } 
    public string PickupInstructions { get; set; } 
    public string PickupReferenceTag { get; set; }
    public string DropoffAddress { get; set; }
    public string DropoffBusinessName { get; set; }
    public string DropoffPhoneNumber { get; set; } 
    public string DropoffInstructions { get; set; } 
    public decimal OrderValue { get; set; } 
    public decimal Tip { get; set; } 
}
