using CommandLine;
using LogNineBackend;
using Microsoft.EntityFrameworkCore;
using AppContext = LogNineBackend.AppContext;

var options = Parser.Default.ParseArguments<Options>(args).Value;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS with proper settings
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:8081", "http://localhost:5173" };

builder.Services.AddCors(options => {
    options.AddPolicy("cors",
        policy => {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppContext>();
builder.Services.AddSignalR();

var app = builder.Build();

var logger = app.Services.GetService<ILogger<Program>>();

// Request size limit middleware with configurable size
var maxRequestSizeKB = builder.Configuration.GetValue<int>("MaxRequestSizeKB", 1024); // Default 1MB
app.Use((context, next) => {
    if (context.Request.ContentLength > maxRequestSizeKB * 1024)
    {
        logger?.LogWarning("Request rejected: Content length {ContentLength} exceeds limit {Limit}", 
            context.Request.ContentLength, maxRequestSizeKB * 1024);
        context.Response.StatusCode = 413;
        return Task.CompletedTask;
    }

    return next(context);
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || options.UseSwagger)
{
    logger!.LogInformation("Using Swagger");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("cors");
app.MapControllers();

app.MapHub<LogNineHub>("lognine-hub");

// if (options.ShouldSeedDatabase)
//     SeedDatabase(app.Services);

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppContext>();
    
    // Apply all migrations (creates database if it doesn't exist)
    logger!.LogInformation("Checking for pending migrations...");
    var pendingMigrations = context.Database.GetPendingMigrations().ToList();
    
    if (pendingMigrations.Any())
    {
        logger.LogInformation($"Applying {pendingMigrations.Count} pending migrations: {string.Join(", ", pendingMigrations)}");
    }
    else
    {
        logger.LogInformation("No pending migrations found");
    }
    
    // Migrate will create the database and apply all migrations
    context.Database.Migrate();
    logger.LogInformation("Database migration completed successfully");
}


app.Run();



void SeedDatabase(IServiceProvider appServices) {
    using var scope = appServices.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppContext>();
    var didSeed = DbSeeder.Seed(context);
    if (!didSeed) return;
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Database seeded");
}
public class Options {
    [Option('s', "swagger", Required = false, HelpText = "Use Swagger")]
    public bool UseSwagger { get; set; }

    [Option("seed", Required = false, HelpText = "Seed the database")]
    public bool ShouldSeedDatabase { get; set; }
}