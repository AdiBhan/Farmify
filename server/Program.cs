using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;

using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from the .env file
Env.Load();

var clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");


Console.WriteLine($"ClientId: {clientId}");
Console.WriteLine($"ClientSecret: {clientSecret}");


// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie() // To store user info in cookies
.AddGoogle(options =>
{
    options.ClientId = clientId;      // Replace with your Google Client ID
    options.ClientSecret = clientSecret;  // Replace with your Google Client Secret
    options.CallbackPath = new PathString("/signin-google"); // Callback URL that Google will redirect to after login
});

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization();  // Add authorization middleware

app.MapGet("/", () =>
{
    return "Hello World!";
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
