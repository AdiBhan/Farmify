using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace FarmifyService.Controllers
{
    [Route("api/paypal")]
    [ApiController]
    public class PayPalController : ControllerBase
    {
        private static readonly string BaseUrl = "https://api-m.sandbox.paypal.com";

        // Endpoint to create an order
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] PayPalOrderRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ClientId) || string.IsNullOrEmpty(request.ClientSecret))
            {
                return BadRequest("Client ID and Secret are required.");
            }

            try
            {
                // Step 1: Get Access Token
                var accessToken = await GetAccessToken(request.ClientId, request.ClientSecret);
                if (string.IsNullOrEmpty(accessToken))
                {
                    return StatusCode(500, "Failed to retrieve PayPal access token.");
                }

                // Step 2: Create PayPal Order
                var order = await CreatePayPalOrder(accessToken, request.Amount, request.Currency,request.Name);
                if (order == null)
                {
                    return StatusCode(500, "Failed to create PayPal order.");
                }

                // Get the approval link
                var approvalLink = order.links.FirstOrDefault(link => link.rel == "approve")?.href;
                if (string.IsNullOrEmpty(approvalLink))
                {
                    return StatusCode(500, "Approval link not found in the PayPal order response.");
                }

                return Ok(new { orderId = order.id, approvalLink });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to capture an order
        [HttpPost("capture-order")]
        public async Task<IActionResult> CaptureOrder([FromBody] PayPalCaptureRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ClientId) || string.IsNullOrEmpty(request.ClientSecret) || string.IsNullOrEmpty(request.OrderId))
            {
                return BadRequest("Client ID, Secret, and Order ID are required.");
            }

            try
            {
                // Step 1: Get Access Token
                var accessToken = await GetAccessToken(request.ClientId, request.ClientSecret);
                if (string.IsNullOrEmpty(accessToken))
                {
                    return StatusCode(500, "Failed to retrieve PayPal access token.");
                }

                // Step 2: Capture Payment
                var captureResponse = await CapturePayment(accessToken, request.OrderId);
                if (captureResponse == null)
                {
                    return StatusCode(500, "Failed to capture payment.");
                }

                return Ok(new
                {
                    captureId = captureResponse.id,
                    captureStatus = captureResponse.status
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to get access token
        private async Task<string> GetAccessToken(string clientId, string clientSecret)
        {
            using (var client = new HttpClient())
            {
                var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authString);

                var requestBody = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");
                var response = await client.PostAsync($"{BaseUrl}/v1/oauth2/token", requestBody);

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<JsonElement>(responseBody).GetProperty("access_token").GetString();
            }
        }

        // Helper method to create a PayPal order
        private async Task<OrderResponse> CreatePayPalOrder(string accessToken, decimal amount, string currency, string name)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var orderRequest = new
                {
                    intent = "CAPTURE",
                    purchase_units = new[]
                    {
                        new
                        {
                            amount = new
                            {
                                currency_code = currency,
                                value = amount.ToString("F2")
                            },
                            description = name
                        }
                    },
                    application_context = new
                    {
                        return_url = "https://example.com/success",
                        cancel_url = "https://example.com/cancel"
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(orderRequest), Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"{BaseUrl}/v2/checkout/orders", content);

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<OrderResponse>(responseBody);
            }
        }

        // Helper method to capture payment for an order
        private async Task<CaptureResponse> CapturePayment(string accessToken, string orderId)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await client.PostAsync($"{BaseUrl}/v2/checkout/orders/{orderId}/capture",
                    new StringContent("", Encoding.UTF8, "application/json"));

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<CaptureResponse>(responseBody);
            }
        }
    }

    // DTO for order creation
    public class PayPalOrderRequest
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public decimal Amount { get; set; }
        public string Name { get; set; }
        public string Currency { get; set; } = "USD";
    }

    // DTO for order capture
    public class PayPalCaptureRequest
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string OrderId { get; set; }
    }

    // Helper classes for JSON deserialization
    public class OrderResponse
    {
        public string id { get; set; }
        public string status { get; set; }
        public Link[] links { get; set; }
    }

    public class CaptureResponse
    {
        public string id { get; set; }
        public string status { get; set; }
    }

    public class Link
    {
        public string href { get; set; }
        public string rel { get; set; }
        public string method { get; set; }
    }
}
