using CommandLine;
using FunWithEF;
using LogNineBackend;
using Microsoft.AspNetCore.HttpLogging;
using AppContext = LogNineBackend.AppContext;

var options = Parser.Default.ParseArguments<Options>(args).Value;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpLogging(o => {
    o.LoggingFields = HttpLoggingFields.All;
});

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

var app = builder.Build();

var logger = app.Services.GetService<ILogger<Program>>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || options.UseSwagger)
{
    logger!.LogInformation("Using Swagger");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpLogging();
app.UseCors("cors");
app.UseWebSockets();
app.MapControllers();

SeedDatabase(app.Services);

void SeedDatabase(IServiceProvider appServices) {
    using var scope = appServices.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppContext>();
    var didSeed = DbSeeder.Seed(context);
    if (!didSeed) return;
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("Database seeded");

}

app.Run();

public class Options {
    //bool option to use swagger or not
    [Option('s', "swagger", Required = false, HelpText = "Use Swagger")]
    public bool UseSwagger { get; set; }
}