// Program.cs
using System;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

class Program
{
    static async Task Main(string[] args)
    {
        // run this line first for testing: dotnet add package System.IdentityModel.Tokens.Jwt
        // Generate the JWT token
        string token = GenerateJwt();
        Console.WriteLine("Generated JWT:");
        Console.WriteLine(token);

        //if access for the doordash simulator is need, please email me at tommyxu@bu.edu 
        //for access to our developer account
        
        // Make the delivery request
        //When testing the get status method, comment this create delivery method out 
        //otherwise it's going to create a conflict
        await CreateDeliveryAsync(token);

        // Check the status of the delivery
        await GetDeliveryStatusAsync(token, "D-12345");
    }

    // Method to generate a JWT
    static string GenerateJwt()
    {
        // Generate the JWT token using JwtGenerator
        var accessKey = new Dictionary<string, string>{
        {"developer_id", "7714fb92-b125-44de-a0da-a5b7529e93a8"},
        {"key_id", "758af6e3-049b-404a-8447-bc14a90c9c7a"},
        {"signing_secret", "Wj2nZ_qTdTYW2R4KhjJ5FkuhU2Ggg6CBfHNW6cZ5ZHc"}
        };
        
       // Decode the DoorDash signing secret from Base64 URL format to a byte array.
        // The `accessKey["signing_secret"]` should be a secret key provided by DoorDash.
        var decodedSecret = Base64UrlEncoder.DecodeBytes(accessKey["signing_secret"]);

        // Create a security key using the decoded secret, which will be used to sign the JWT.
        // The security key is created with symmetric encryption using the secret.
        var securityKey = new SymmetricSecurityKey(decodedSecret);

        // Set up signing credentials with the security key and specify HMAC-SHA256 as the algorithm.
        // This will be used to sign the JWT to ensure integrity and authenticity.
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Create a JWT header that includes the signing credentials.
        // The `dd-ver` header is set to `DD-JWT-V1`, indicating the JWT version expected by DoorDash.
        var header = new JwtHeader(credentials);
        header["dd-ver"] = "DD-JWT-V1";

        // Create a JWT payload with necessary claims:
        // - `issuer`: the developer's ID
        // - `audience`: "doordash" to indicate that this token is intended for the DoorDash API
        // - `claims`: a list of additional claims, in this case, the key ID (`kid`) from the access key
        // - `expires`: sets the token expiration time to 300 seconds (5 minutes) from now
        // - `issuedAt`: sets the time when the token was issued, which is the current UTC time
        var payload = new JwtPayload(
            issuer: accessKey["developer_id"],
            audience: "doordash",
            claims: new List<Claim> { new Claim("kid", accessKey["key_id"]) },
            notBefore: null,
            expires: DateTime.UtcNow.AddSeconds(300),
            issuedAt: DateTime.UtcNow
        );

        // Create the JWT by combining the header and payload, signing it with the credentials.
        // This generates a complete JWT object.
        var securityToken = new JwtSecurityToken(header, payload);

        // Serialize the JWT into a compact format, which can be used in the Authorization header.
        var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

        // Return the generated token string, which can be sent in the Authorization header of an API request.
        return token;
    }

    // Method to create a delivery request
    static async Task CreateDeliveryAsync(string token)
    {
        try
        {
            var jsonContent = JsonSerializer.Serialize(new
            {
                external_delivery_id = "D-12345",
                pickup_address = "901 Market Street 6th Floor San Francisco, CA 94103",
                pickup_business_name = "Wells Fargo SF Downtown",
                pickup_phone_number = "+16505555555",
                pickup_instructions = "Enter gate code 1234 on the callbox.",
                pickup_reference_tag = "Order number 61",
                dropoff_address = "901 Market Street 6th Floor San Francisco, CA 94103",
                dropoff_business_name = "Wells Fargo SF Downtown",
                dropoff_phone_number = "+16505555555",
                dropoff_instructions = "Enter gate code 1234 on the callbox."
            });

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            // Send the POST request
            var result = await client.PostAsync("https://openapi.doordash.com/drive/v2/deliveries", content);

            // Get the response status code
            var status = result.StatusCode;
            Console.WriteLine($"Status Code: {status}");

            // Get the response content
            var resultString = await result.Content.ReadAsStringAsync();
            Console.WriteLine("Response Content:");
            Console.WriteLine(resultString);
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred:");
            Console.WriteLine(ex.Message);
        }
    }

    // Method to get the status of a delivery
    static async Task GetDeliveryStatusAsync(string token, string deliveryId)
    {
        try
        {
            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            // Send the GET request
            var result = await client.GetAsync($"https://openapi.doordash.com/drive/v2/deliveries/{deliveryId}");

            // Get the response status code
            var status = result.StatusCode;
            Console.WriteLine($"Get Delivery Status Code: {status}");

            // Get the response content
            var resultString = await result.Content.ReadAsStringAsync();
            Console.WriteLine("Get Delivery Status Response Content:");
            Console.WriteLine(resultString);
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred while fetching the delivery status:");
            Console.WriteLine(ex.Message);
        }
    }
}

        