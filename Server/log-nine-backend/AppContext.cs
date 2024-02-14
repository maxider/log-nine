using Microsoft.EntityFrameworkCore;

namespace FunWithEF;

public class AppContext : DbContext {
    public DbSet<JobTask> JobTasks { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Board> Boards { get; set; }

    public string DbPath { get; private set; }

    public AppContext() {
        DbPath = "./data.db";
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        optionsBuilder.UseSqlite($"Data Source={DbPath}");
    }
}