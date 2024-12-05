using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[Route("api/deliveries")]
[ApiController]
public class DoorDashController : ControllerBase
{
    private readonly string _developerId = "7714fb92-b125-44de-a0da-a5b7529e93a8";
    private readonly string _keyId = "758af6e3-049b-404a-8447-bc14a90c9c7a";
    private readonly string _signingSecret = "Wj2nZ_qTdTYW2R4KhjJ5FkuhU2Ggg6CBfHNW6cZ5ZHc";

    private string GenerateJwt()
    {
        var decodedSecret = Base64UrlEncoder.DecodeBytes(_signingSecret);
        var securityKey = new SymmetricSecurityKey(decodedSecret);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var header = new JwtHeader(credentials);
        header["dd-ver"] = "DD-JWT-V1";

        var payload = new JwtPayload(
            issuer: _developerId,
            audience: "doordash",
            claims: new List<Claim> { new Claim("kid", _keyId) },
            notBefore: null,
            expires: DateTime.UtcNow.AddSeconds(300),
            issuedAt: DateTime.UtcNow);

        var securityToken = new JwtSecurityToken(header, payload);
        return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }

[HttpPost("generate")]
public async Task<IActionResult> GenerateDeliveryOrder([FromBody] DeliveryRequest request)
{
    try
    {
        string jwtToken = GenerateJwt();
        Console.WriteLine($"OrderValue: {request.OrderValue}");
    Console.WriteLine($"Tip: {request.Tip}");

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

        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);
        var response = await client.PostAsync("https://openapi.doordash.com/drive/v2/deliveries", content);

        var responseBody = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, responseBody);
        }

        return Ok(responseBody);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Error: {ex.Message}");
    }
}


    [HttpGet("track/{deliveryId}")]
    public async Task<IActionResult> TrackOrder(string deliveryId)
    {
        try
        {
            string jwtToken = GenerateJwt();

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);
            var response = await client.GetAsync($"https://openapi.doordash.com/drive/v2/deliveries/{deliveryId}");

            var responseBody = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, responseBody);
            }

            return Ok(responseBody);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}

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