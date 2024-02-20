using System.Text.Json.Serialization;
using CommandLine;
using LogNineBackend;
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