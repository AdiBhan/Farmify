using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using DotNetEnv;
using System.Security.Claims;

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
    options.ClientId = clientId; // Use environment variable
    options.ClientSecret = clientSecret; // Use environment variable
    options.CallbackPath = new PathString("/signin-google"); // Callback URL
      options.Scope.Add("email");// Request email scope from Google. By default OAuth doesn't give us access to user email. 
      // We store this in database
});

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();  // Enabling Swagger for endpoint testing in development
    app.UseSwaggerUI();
}

app.UseRouting(); // Adding Routing support

app.UseAuthentication(); //  Adding Authorization support
app.UseAuthorization();  // Adding Authentication support

// Initial/Root route, for testing purposes. Making sure localhost:4000 is reachable
app.MapGet("/", (HttpContext httpContext) =>
{
    return new {
        Message = "Welcome to Farmify!"
    };
});

// Success Route. User sent here after authentication.
app.MapGet("success", (HttpContext httpContext) =>
{
    
    var email = httpContext.User.FindFirst(ClaimTypes.Email)?.Value;
    // JSON Response object w/ Menssage, User, IsAuth, Email
    return new
    {
        Message = "You have successfully logged in with Google!",
        User = httpContext.User.Identity.Name,
        IsAuthenticated = httpContext.User.Identity.IsAuthenticated,
        Email = email
    };
});



app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
// Start App
app.Run();
