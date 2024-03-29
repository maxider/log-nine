using CommandLine;
using LogNineBackend;
using Microsoft.EntityFrameworkCore;
using AppContext = LogNineBackend.AppContext;

var options = Parser.Default.ParseArguments<Options>(args).Value;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("cors",
        policy => {
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowAnyOrigin();
        });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppContext>();
builder.Services.AddSignalR();
builder.Services.AddSingleton<LogNineHub>();

var app = builder.Build();

var logger = app.Services.GetService<ILogger<Program>>();

app.Use((context, next) => {
    if (context.Request.ContentLength > 10 * 1024)
    {
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

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());
app.MapControllers();

app.MapHub<LogNineHub>("lognine-hub");

// if (options.ShouldSeedDatabase)
//     SeedDatabase(app.Services);

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<AppContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
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