using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using DotNetEnv;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using FarmifyService.models;
// Added usings for DoorDash integration
using System;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from the .env file
Env.Load();

var clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");

var DeveloperId = "7714fb92-b125-44de-a0da-a5b7529e93a8";
var KeyId = "758af6e3-049b-404a-8447-bc14a90c9c7a";
var SigningSecret = "Wj2nZ_qTdTYW2R4KhjJ5FkuhU2Ggg6CBfHNW6cZ5ZHc";
// Add API explorer and Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//  Enables CORS for http://localhost:8081 to allow React Native frontend to send requests on diff port (:8081)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost8081",
        policy => policy
            .WithOrigins("http://localhost:8081")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddControllersWithViews();

// Connection string to external AWS SQL Database hosted by Supabase. 
// Configure database
// Configure database with Supabase-specific settings
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorCodesToAdd: null);
            npgsqlOptions.CommandTimeout(300);
            npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "public");
        });
});

var app = builder.Build();
app.UseCors("AllowLocalhost8081");

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Initial route for testing
app.MapGet("/", (HttpContext httpContext) =>
{
    return new
    {
        Message = "Welcome to Farmify!"
    };
});

// Set up controller routing
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");



// DoorDash Delivery Endpoint Integration


// Map POST request to /api/delivery/doordash
app.MapPost("/api/delivery/doordash", async (HttpContext context) =>
{
    try
    {
        // Read the DeliveryRequest from the request body
        var deliveryRequest = await context.Request.ReadFromJsonAsync<DeliveryRequest>();
        if (deliveryRequest == null)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsync("Invalid delivery request data.");
            return;
        }

        if (string.IsNullOrEmpty(developerId) || string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(signingSecret))
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("DoorDash API credentials are not configured.");
            return;
        }

        // Generate JWT token
        string token = GenerateJwt(developerId, keyId, signingSecret);

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

        using HttpClient client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // Send the POST request to DoorDash API
        var result = await client.PostAsync("https://openapi.doordash.com/drive/v2/deliveries", content);

        // Get the response content
        var resultString = await result.Content.ReadAsStringAsync();

        if (!result.IsSuccessStatusCode)
        {
            // Log and return the error
            Console.WriteLine($"DoorDash API Error: {result.StatusCode}, {resultString}");
            context.Response.StatusCode = (int)result.StatusCode;
            await context.Response.WriteAsync(resultString);
            return;
        }

        // Return the successful response to the frontend
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(resultString);
    }
    catch (Exception ex)
    {
        // Log the exception
        Console.WriteLine("Error creating DoorDash delivery:", ex);
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Error: {ex.Message}");
    }
});

// Helper method to generate JWT token
string GenerateJwt(string developerId, string keyId, string signingSecret)
{
    // Decode the DoorDash signing secret from Base64 URL format to a byte array
    var decodedSecret = Base64UrlEncoder.DecodeBytes(signingSecret);

    // Create a security key using the decoded secret
    var securityKey = new SymmetricSecurityKey(decodedSecret);

    // Set up signing credentials with the security key and specify HMAC-SHA256 as the algorithm
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    // Create a JWT header that includes the signing credentials
    var header = new JwtHeader(credentials);
    header["dd-ver"] = "DD-JWT-V1";

    // Create a JWT payload with necessary claims
    var payload = new JwtPayload(
        issuer: developerId,
        audience: "doordash",
        claims: new List<Claim> { new Claim("kid", keyId) },
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

// Define the DeliveryRequest model
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

app.Run();
