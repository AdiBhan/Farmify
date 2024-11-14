using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using DotNetEnv;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using Microsoft.AspNetCore.Authentication.Google;
using FarmifyService.models;
var builder = WebApplication.CreateBuilder(args);

// Load environment variables from the .env file
Env.Load();

var clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");

// Add API explorer and Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie() // To store user info in cookies
.AddGoogle(options =>
{
    options.ClientId = clientId;
    options.ClientSecret = clientSecret;
    options.CallbackPath = new PathString("/signin-google");
    options.Scope.Add("email"); // Request email scope from Google
});

//  Enables CORS for https:localhost8081 to allow React Native frontend to send request on diff port (:8081)
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

// Success route after Google authentication
app.MapGet("/success", (HttpContext httpContext) =>
{
    var email = httpContext.User.FindFirst(ClaimTypes.Email)?.Value;
    return new
    {
        Message = "You have successfully logged in with Google!",
        User = httpContext.User.Identity.Name,
        IsAuthenticated = httpContext.User.Identity.IsAuthenticated,
        Email = email
    };
});

// Set up controller routing
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
