using FunWithEF;
using LogNineBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LogNineBackend;

public class AppContext : DbContext {
    private readonly ILogger<AppContext> logger;

    public DbSet<JobTask> JobTasks { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Board> Boards { get; set; }

    public string DbPath { get; private set; }

    public AppContext(ILogger<AppContext> logger) {
        this.logger = logger;
        DbPath = "./data/data.db";
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        optionsBuilder.UseSqlite($"Data Source={DbPath}");
    }
}