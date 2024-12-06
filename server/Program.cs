using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using DotNetEnv;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using FarmifyService.Data;
using FarmifyService.models;
using Npgsql; // Add this
using Npgsql.Internal; // Add if needed
using Npgsql.TypeMapping; // Add if needed

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
Env.Load();

var clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");

// Add API explorer and Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enables CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost8081",
        policy => policy
            .WithOrigins("http://localhost:8081")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddControllersWithViews();

// Get the connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Create and configure the Npgsql data source builder
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);

// Enable dynamic JSON serialization
// This allows storing arbitrary types as JSON using System.Text.Json without additional configuration
dataSourceBuilder.EnableDynamicJson();

// Build the data source
var dataSource = dataSourceBuilder.Build();

// Configure DbContext to use the pre-built data source
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        dataSource,
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

app.MapGet("/", (HttpContext httpContext) =>
{
    return new
    {
        Message = "Welcome to Farmify!"
    };
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
