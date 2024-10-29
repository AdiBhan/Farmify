using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    // Fetch client ID and secret from environment variables
    private static readonly string clientId = "ATX8G7rskorvQyww9K29BSWp9mgv37Y6va00WOODv61YRK2NCW9B5t9BuNJZ5U6fIbbikC7fqnGLjdYx";
    private static readonly string clientSecret = "EGHUYP_Y1DNDyxz3srwx8i5tQXpLNUaU2uH3zaB5VuqNSmA64N4z54K--Gmb_a-yGVlkkp993duSHRmm";
    private static readonly string baseUrl = "https://api-m.sandbox.paypal.com"; // Use live URL for production

    static async Task Main(string[] args)
{
    if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
    {
        Console.WriteLine("Error: PayPal client ID and secret are not set. Please set them in your environment variables.");
        return;
    }

    Console.WriteLine("Starting PayPal Order Creation Process...");

    // Step 1: Get Access Token
    Console.WriteLine("Getting Access Token...");
    var accessToken = await GetAccessToken();
    Console.WriteLine("Access Token Retrieved: " + accessToken);

    // Step 2: Create Order
    Console.WriteLine("Creating a new PayPal order...");
    var order = await CreateOrder(accessToken);

    if (order != null)
    {
        Console.WriteLine("Order Created Successfully!");
        Console.WriteLine("Order ID: " + order.id);
        Console.WriteLine("Order Status: " + order.status);
        Console.WriteLine(JsonSerializer.Serialize(order, new JsonSerializerOptions { WriteIndented = true }));
        // Display the approval URL
        var approvalLink = order.links.FirstOrDefault(link => link.rel == "payer-action")?.href;
        if (!string.IsNullOrEmpty(approvalLink))
        {
            Console.WriteLine("Please visit the following URL to approve the payment:");
            Console.WriteLine(approvalLink);
        }
        else
        {
            Console.WriteLine("No approval link found in the response.");
        }

        // Step 3: Capture Payment (after user approves)
        Console.WriteLine("Waiting for user to approve payment...");
        Console.WriteLine("Press Enter to capture the payment once approved in PayPal.");
        Console.ReadLine();

        var captureResponse = await CapturePayment(accessToken, order.id);
        if (captureResponse != null)
        {
            Console.WriteLine("Payment captured successfully!");
            Console.WriteLine("Capture ID: " + captureResponse.id);
            Console.WriteLine("Capture Status: " + captureResponse.status);
            
            // Step 4: Check Order Details (after capturing the payment)
            Console.WriteLine("Full Order Details:");
            var orderDetails = await GetOrderDetails(accessToken, order.id);
            
        }
        else
        {
            Console.WriteLine("Failed to capture payment.");
        }
    }
    else
    {
        Console.WriteLine("Failed to create order.");
    }
}

    // Step 1: Get Access Token
    static async Task<string> GetAccessToken()
    {
        using (var client = new HttpClient())
        {
            var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authString);

            var requestBody = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");
            var response = await client.PostAsync($"{baseUrl}/v1/oauth2/token", requestBody);

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Access Token Request Successful.");
                var responseBody = await response.Content.ReadAsStringAsync();
                var token = JsonSerializer.Deserialize<JsonElement>(responseBody).GetProperty("access_token").GetString();
                return token;
            }
            else
            {
                Console.WriteLine("Failed to retrieve access token.");
                var errorResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine("Error: " + errorResponse);
                throw new Exception("Failed to retrieve access token.");
            }
        }
    }

    // Step 2: Create Order
static async Task<OrderResponse> CreateOrder(string accessToken)
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
                    reference_id = "default",
                    amount = new
                    {
                        currency_code = "USD",
                        value = "999.00"
                    }
                }
            },
            payment_source = new
            {
                paypal = new
                {
                    experience_context = new
                    {
                        payment_method_preference = "IMMEDIATE_PAYMENT_REQUIRED",
                        brand_name = "EXAMPLE INC",
                        locale = "en-US",
                        landing_page = "LOGIN",
                        shipping_preference = "GET_FROM_FILE",
                        user_action = "PAY_NOW",
                        return_url = "https://example.com/returnUrl",
                        cancel_url = "https://example.com/cancelUrl"
                    }
                }
            }
        };

        var content = new StringContent(JsonSerializer.Serialize(orderRequest), Encoding.UTF8, "application/json");
        var response = await client.PostAsync($"{baseUrl}/v2/checkout/orders", content);

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Order Creation Request Successful.");
            var responseBody = await response.Content.ReadAsStringAsync();
            var order = JsonSerializer.Deserialize<OrderResponse>(responseBody);
            return order;
        }
        else
        {
            Console.WriteLine("Failed to create order.");
            var errorResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Error: " + errorResponse);
            return null;
        }
    }
}



    // Step 3: Capture Payment
static async Task<CaptureResponse> CapturePayment(string accessToken, string orderId)
{
    using (var client = new HttpClient())
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await client.PostAsync($"{baseUrl}/v2/checkout/orders/{orderId}/capture", 
            new StringContent("", Encoding.UTF8, "application/json"));

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Payment Capture Request Successful.");
            var responseBody = await response.Content.ReadAsStringAsync();
            var capture = JsonSerializer.Deserialize<CaptureResponse>(responseBody);
            return capture;
        }
        else
        {
            Console.WriteLine("Failed to capture payment.");
            var errorResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Error: " + errorResponse);
            return null;
        }
    }
}

static async Task<OrderResponse> GetOrderDetails(string accessToken, string orderId)
{
    using (var client = new HttpClient())
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("*/*")); // Match Postman Accept header

        var response = await client.GetAsync($"{baseUrl}/v2/checkout/orders/{orderId}");

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Order Details Request Successful.");
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Order Details JSON:");
            Console.WriteLine(responseBody); // Print full JSON response
            var order = JsonSerializer.Deserialize<OrderResponse>(responseBody);
            return order;
        }
        else
        {
            Console.WriteLine("Failed to retrieve order details.");
            var errorResponse = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Error: " + errorResponse);
            return null;
        }
    }
}
}


// Helper class for deserializing the order response
public class OrderResponse
{
    public string id { get; set; }
    public string status { get; set; }
    public Link[] links { get; set; }
}

public class Link
{
    public string href { get; set; }
    public string rel { get; set; }
    public string method { get; set; }
}

// Helper class for deserializing the capture response
public class CaptureResponse
{
    public string id { get; set; }
    public string status { get; set; }
}